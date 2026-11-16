import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import "./RegisterPOS.css";
import { apiFetch } from "../../api";

function getStock(product) {
    return Number(product.stock_quantity ?? product.em_estoque ?? 0);
}

function getPrice(product) {
    return Number(product.sale_price ?? product.precoVenda ?? product.final_price ?? 0);
}

function getName(product) {
    return product.name || product.nomeProduto || "Produto sem nome";
}

function formatCurrency(value) {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL"
    }).format(value);
}

async function readProductResponse(response) {
    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || error.error || "Não foi possível concluir a consulta.");
    }
    return response.json();
}

function RegisterPOS() {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [search, setSearch] = useState("");
    const [barcode, setBarcode] = useState("");
    const [message, setMessage] = useState("");
    const [receipt, setReceipt] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSearchingBarcode, setIsSearchingBarcode] = useState(false);
    const [isFinalizing, setIsFinalizing] = useState(false);

    async function loadProducts() {
        try {
            const response = await apiFetch("/produtos");
            setProducts(await readProductResponse(response));
        } catch (error) {
            setMessage(`Não foi possível carregar os produtos: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        let isActive = true;

        apiFetch("/produtos")
            .then(readProductResponse)
            .then((data) => {
                if (isActive) setProducts(data);
            })
            .catch((error) => {
                if (isActive) setMessage(`Não foi possível carregar os produtos: ${error.message}`);
            })
            .finally(() => {
                if (isActive) setIsLoading(false);
            });

        return () => {
            isActive = false;
        };
    }, []);

    const filteredProducts = useMemo(() => {
        const term = search.trim().toLocaleLowerCase("pt-BR");
        if (!term) return products;

        return products.filter((product) => [
            getName(product),
            product.sku,
            product.barcode,
            product.codigoBarras
        ].some((value) => String(value || "").toLocaleLowerCase("pt-BR").includes(term)));
    }, [products, search]);

    const total = cart.reduce((sum, item) => sum + getPrice(item.product) * item.quantity, 0);
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    function addToCart(product) {
        if (getStock(product) <= 0) {
            setMessage(`${getName(product)} está sem estoque.`);
            return;
        }

        setCart((currentCart) => {
            const existing = currentCart.find((item) => item.product.id === product.id);
            if (existing) {
                if (existing.quantity >= getStock(product)) {
                    setMessage(`Estoque máximo disponível para ${getName(product)}.`);
                    return currentCart;
                }
                return currentCart.map((item) => item.product.id === product.id
                    ? { ...item, quantity: item.quantity + 1, product }
                    : item);
            }
            return [...currentCart, { product, quantity: 1 }];
        });
        setMessage("");
    }

    async function selectProduct(product) {
        try {
            const currentProduct = await readProductResponse(await apiFetch(`/produtos/${product.id}`));
            addToCart(currentProduct);
        } catch (error) {
            setMessage(`Não foi possível consultar o produto: ${error.message}`);
        }
    }

    async function findByBarcode(event) {
        event.preventDefault();
        const code = barcode.trim();
        if (!code || isSearchingBarcode) return;

        setIsSearchingBarcode(true);
        try {
            const product = await readProductResponse(await apiFetch(`/produtos/codigo/${encodeURIComponent(code)}`));
            addToCart(product);
            setBarcode("");
        } catch (error) {
            setMessage(error.message === "Nenhum produto encontrado com este código"
                ? `Nenhum produto encontrado para o código ${code}.`
                : `Falha ao buscar o código: ${error.message}`);
        } finally {
            setIsSearchingBarcode(false);
        }
    }

    function changeQuantity(productId, nextQuantity) {
        setCart((currentCart) => currentCart.flatMap((item) => {
            if (item.product.id !== productId) return [item];
            if (nextQuantity < 1) return [];
            return [{ ...item, quantity: Math.min(nextQuantity, getStock(item.product)) }];
        }));
    }

    async function finalizeSale() {
        if (!cart.length || isFinalizing) return;
        setIsFinalizing(true);
        setMessage("");
        let stockUpdateStarted = false;

        try {
            const checkedItems = await Promise.all(cart.map(async (item) => {
                const currentProduct = await readProductResponse(await apiFetch(`/produtos/${item.product.id}`));
                if (getStock(currentProduct) < item.quantity) {
                    throw new Error(`Estoque insuficiente para ${getName(currentProduct)}. Atualize o carrinho.`);
                }
                return { ...item, product: currentProduct };
            }));

            for (const item of checkedItems) {
                stockUpdateStarted = true;
                const response = await apiFetch(`/produtos/${item.product.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ stock_quantity: getStock(item.product) - item.quantity })
                });
                await readProductResponse(response);
            }

            setReceipt({
                code: `PDV-${Date.now()}`,
                issuedAt: new Date().toISOString(),
                items: checkedItems,
                total: checkedItems.reduce((sum, item) => sum + getPrice(item.product) * item.quantity, 0),
                itemCount: checkedItems.reduce((sum, item) => sum + item.quantity, 0)
            });
            setCart([]);
            setMessage("Venda finalizada. O comprovante está pronto para impressão.");
            await loadProducts();
        } catch (error) {
            if (stockUpdateStarted) setCart([]);
            setMessage(stockUpdateStarted
                ? `Falha ao atualizar o estoque durante a venda: ${error.message} O carrinho foi limpo para evitar uma baixa duplicada; confira o estoque dos produtos.`
                : `Venda não concluída: ${error.message}`);
            await loadProducts();
        } finally {
            setIsFinalizing(false);
        }
    }

    return (
        <>
            <Header />
            <main className="pos-page">
                <section className="pos-heading">
                    <div>
                        <p className="pos-eyebrow">OPERAÇÃO DE VENDA</p>
                        <h1>Frente de caixa</h1>
                        <p className="pos-subtitle">Consulte produtos, monte o pedido e atualize o estoque ao finalizar.</p>
                    </div>
                    <Link to="/Produtos" className="pos-products-link">Gerenciar produtos <span aria-hidden="true">↗</span></Link>
                </section>

                {message && <div className="pos-message" role="status">{message}</div>}

                <div className="pos-workspace">
                    <section className="pos-catalog" aria-labelledby="catalog-title">
                        <div className="pos-section-heading">
                            <div>
                                <span className="pos-section-kicker">CATÁLOGO</span>
                                <h2 id="catalog-title">Adicionar produtos</h2>
                            </div>
                            <span className="pos-product-count">{products.length} itens</span>
                        </div>

                        <form className="pos-barcode-form" onSubmit={findByBarcode}>
                            <label htmlFor="pos-barcode">Código de barras ou SKU</label>
                            <div className="pos-search-line">
                                <input
                                    id="pos-barcode"
                                    autoFocus
                                    value={barcode}
                                    onChange={(event) => setBarcode(event.target.value)}
                                    placeholder="Leia ou digite o código"
                                />
                                <button type="submit" disabled={isSearchingBarcode || !barcode.trim()}>
                                    {isSearchingBarcode ? "Buscando..." : "Adicionar"}
                                </button>
                            </div>
                        </form>

                        <label className="pos-filter-label" htmlFor="pos-filter">Buscar no catálogo</label>
                        <input
                            id="pos-filter"
                            className="pos-filter"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Nome, SKU ou código de barras"
                        />

                        <div className="pos-product-list">
                            {isLoading ? <p className="pos-empty">Carregando produtos...</p> : filteredProducts.map((product) => (
                                <button
                                    type="button"
                                    className="pos-product-row"
                                    key={product.id}
                                    onClick={() => selectProduct(product)}
                                    disabled={getStock(product) <= 0}
                                >
                                    <span className="pos-product-initial" aria-hidden="true">{getName(product).slice(0, 1).toUpperCase()}</span>
                                    <span className="pos-product-details">
                                        <strong>{getName(product)}</strong>
                                        <small>{product.sku || product.barcode || product.codigoBarras || "Sem código"} · Estoque {getStock(product)}</small>
                                    </span>
                                    <span className="pos-product-price">{formatCurrency(getPrice(product))}</span>
                                    <span className="pos-add-mark" aria-hidden="true">+</span>
                                </button>
                            ))}
                            {!isLoading && filteredProducts.length === 0 && (
                                <p className="pos-empty">Nenhum produto disponível para esta busca.</p>
                            )}
                        </div>
                    </section>

                    <section className="pos-checkout" aria-labelledby="checkout-title">
                        <div className="pos-section-heading">
                            <div>
                                <span className="pos-section-kicker">PEDIDO ATUAL</span>
                                <h2 id="checkout-title">Venda</h2>
                            </div>
                            <span className="pos-cart-count">{itemCount}</span>
                        </div>

                        <div className="pos-cart-items">
                            {cart.length === 0 ? (
                                <div className="pos-cart-empty">
                                    <span aria-hidden="true">＋</span>
                                    <p>Seu pedido está vazio</p>
                                    <small>Adicione um produto pelo catálogo ou código.</small>
                                </div>
                            ) : cart.map((item) => (
                                <div className="pos-cart-item" key={item.product.id}>
                                    <div className="pos-cart-item-info">
                                        <strong>{getName(item.product)}</strong>
                                        <small>{formatCurrency(getPrice(item.product))} / un.</small>
                                    </div>
                                    <div className="pos-quantity-control" aria-label={`Quantidade de ${getName(item.product)}`}>
                                        <button type="button" onClick={() => changeQuantity(item.product.id, item.quantity - 1)} aria-label="Diminuir quantidade">−</button>
                                        <span>{item.quantity}</span>
                                        <button type="button" onClick={() => changeQuantity(item.product.id, item.quantity + 1)} aria-label="Aumentar quantidade" disabled={item.quantity >= getStock(item.product)}>+</button>
                                    </div>
                                    <strong className="pos-line-total">{formatCurrency(getPrice(item.product) * item.quantity)}</strong>
                                </div>
                            ))}
                        </div>

                        <div className="pos-total-row">
                            <span>Total da venda</span>
                            <strong>{formatCurrency(total)}</strong>
                        </div>
                        <button
                            type="button"
                            className="pos-finish-button"
                            onClick={finalizeSale}
                            disabled={!cart.length || isFinalizing}
                        >
                            {isFinalizing ? "Atualizando estoque..." : "Finalizar venda"}
                            {!isFinalizing && <span aria-hidden="true">→</span>}
                        </button>
                    </section>
                </div>
            </main>
            {receipt && (
                <div className="pos-receipt-modal" role="dialog" aria-modal="true" aria-labelledby="receipt-title">
                    <div className="pos-receipt-dialog">
                        <div className="pos-receipt-actions">
                            <h2 id="receipt-title">Comprovante da venda</h2>
                            <button type="button" className="pos-receipt-close" onClick={() => setReceipt(null)} aria-label="Fechar comprovante">×</button>
                        </div>
                        <article className="pos-receipt-paper">
                            <header className="pos-receipt-header">
                                <strong>COMPROVANTE DE VENDA</strong>
                                <span>DOCUMENTO NÃO FISCAL</span>
                                <span>SGPR · Frente de caixa</span>
                            </header>
                            <div className="pos-receipt-meta">
                                <span>Venda: {receipt.code}</span>
                                <span>{new Date(receipt.issuedAt).toLocaleString("pt-BR")}</span>
                            </div>
                            <div className="pos-receipt-items">
                                {receipt.items.map((item) => (
                                    <div className="pos-receipt-item" key={item.product.id}>
                                        <strong>{getName(item.product)}</strong>
                                        <div>
                                            <span>{item.quantity} x {formatCurrency(getPrice(item.product))}</span>
                                            <b>{formatCurrency(item.quantity * getPrice(item.product))}</b>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="pos-receipt-summary">
                                <span>Itens: {receipt.itemCount}</span>
                                <strong>TOTAL <b>{formatCurrency(receipt.total)}</b></strong>
                            </div>
                            <footer className="pos-receipt-footer">Obrigado pela compra.</footer>
                        </article>
                        <div className="pos-receipt-actions pos-receipt-actions-bottom">
                            <button type="button" className="pos-receipt-secondary" onClick={() => setReceipt(null)}>Fechar</button>
                            <button type="button" className="pos-receipt-print" onClick={() => window.print()}>Imprimir comprovante</button>
                        </div>
                    </div>
                </div>
            )}
            <Footer />
        </>
    );
}

export default RegisterPOS;