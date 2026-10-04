import { useState } from "react"
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import "./Register.css"

function RegisterProduct() {
    const [activeTab, setActiveTab] = useState('form');
    const [products, setProducts] = useState([]);

    const [formData, setFormData] = useState({
        nomeProduto: "",
        sku: "",
        codigoBarras: "", // EAN (Obrigatório para NF-e)
        ncm: "",          // Classificação Fiscal (Obrigatório para NF-e)
        unidade: "",      // UN, KG, CX, etc.
        precoVenda: "",
        precoCusto: "",
        origemProduto: "0", // Nacional, Importado, etc.
        categoria: ""
    });

    // Função extraída para podermos recarregar a lista após deletar
    const fetchProducts = async () => {
        try {
            const resposta = await fetch("http://localhost:3000/produtos");
            if (resposta.ok) {
                const data = await resposta.json();
                setProducts(data);
            }
        } catch (error) {
            console.log("Erro ao carregar produtos: ", error);
        }
    };

    const handlerChangeTab = async (tab) => {
        setActiveTab(tab);
        if (tab === 'list') {
            fetchProducts();
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    // Rota para cadastrar produto
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:3000/produtos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const produtoCriado = await response.json(); 
                setFormData(prev => ({ ...prev, id: produtoCriado.id }));
                alert(`Produto salvo com sucesso! ID gerado: ${produtoCriado.id}`);
            } else {
                alert("Erro ao salvar produto.");
            }
        } catch (error) {
            console.error("Erro ao cadastrar:", error);
        }
    };

    // Rota para editar
    const handleEdit = async (e) => {
        e.preventDefault();
        const response = await fetch(`http://localhost:3000/produtos/${formData.id}`, {
            method: "PUT",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            alert("Produto atualizado com sucesso")
        }
    }

    // Rota para deletar
    const handlerDelete = async () => {
        if (!formData.id) {
            alert("Selecione um produto existente para deletar");
            return;
        }
        try {
            console.log("Enviando requisição DELETE para ID:", formData.id);
            const response = await fetch(`http://localhost:3000/produtos/${formData.id}`, {
                method: "DELETE"
            });
            console.log("Status da resposta:", response.status);

            if (response.ok) {
                alert("Produto deletado com sucesso!");
                setFormData({
                    nomeProduto: "", sku: "", codigoBarras: "", ncm: "", 
                    unidade: "", precoVenda: "", precoCusto: "", origemProduto: "0", categoria: ""
                });
                
                // Se deletou pela aba de listagem, atualiza a tabela na hora
                if (activeTab === 'list') {
                    fetchProducts();
                }
            } else {
                alert(`Erro ao deletar. Servidor respondeu com status: ${response.status}`);
            }
        } catch (error) {
            console.error("Erro na comunicação com a API:", error);
        }
    };

    // Função para lidar com a seleção do Checkbox na tabela
    const handleSelect = (prod) => {
        // Se clicar no mesmo que já está selecionado, ele desmarca e limpa
        if (formData.id === prod.id) {
            setFormData({
                nomeProduto: "", sku: "", codigoBarras: "", ncm: "", 
                unidade: "", precoVenda: "", precoCusto: "", origemProduto: "0", categoria: "", id: null
            });
        } else {
            // Se marcar, preenche os dados no form para permitir edição/deleção
            setFormData({
                id: prod.id,
                nomeProduto: prod.name || prod.nomeProduto || "",
                sku: prod.sku || "",
                codigoBarras: prod.barcode || prod.codigoBarras || "",
                ncm: prod.ncm_code || prod.ncm || "",
                unidade: prod.unit || prod.unidade || "",
                precoVenda: prod.sale_price || prod.precoVenda || "",
                precoCusto: prod.cost_price || prod.precoCusto || "",
                origemProduto: prod.origin_code || prod.origemProduto || "0",
                categoria: prod.category || prod.categoria || ""
            });
        }
    };

    return (
        <>
            <Header />

            <main className="register-page-container">
                <div className="register-card">
                    
                    {/* BOTOES DAS ABAS */}
                    <div className="tabs-container">
                        <button 
                            type="button" 
                            className={`tab-button ${activeTab === 'form' ? 'active' : ''}`}
                            onClick={() => handlerChangeTab('form')}
                        >
                            Cadastrar Produto
                        </button>
                        <button 
                            type="button" 
                            className={`tab-button ${activeTab === 'list' ? 'active' : ''}`}
                            onClick={() => handlerChangeTab('list')}
                        >
                            Visualizar Produtos
                        </button>
                    </div>

                    {/* ABA 1: FORMULÁRIO */}
                    {activeTab === 'form' && (
                        <>
                            <div className="register-header">
                                <h2>Cadastro de Produto</h2>
                                <p>Insira os dados técnicos e fiscais obrigatórios para a emissão de nota fiscal.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="register-form">
                                <div className="form-group full-width">
                                    <label htmlFor="nomeProduto">Nome do Produto / Descrição (NF-e)</label>
                                    <input type="text" id="nomeProduto" name="nomeProduto" value={formData.nomeProduto} onChange={handleChange} placeholder="Ex: Camiseta de Algodão Egípcio Preta M" required />
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="sku">SKU (Código Interno)</label>
                                        <input type="text" id="sku" name="sku" value={formData.sku} onChange={handleChange} placeholder="Ex: CAM-PRETA-M" required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="codigoBarras">Código de Barras / EAN</label>
                                        <input type="text" id="codigoBarras" name="codigoBarras" value={formData.codigoBarras} onChange={handleChange} placeholder="7890000000000 (ou 'SEM GTIN')" required />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="ncm">NCM (8 dígitos fiscais)</label>
                                        <input type="text" id="ncm" name="ncm" value={formData.ncm} onChange={handleChange} placeholder="Ex: 6109.10.00" maxLength="10" required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="unidade">Unidade Comercial</label>
                                        <select id="unidade" name="unidade" value={formData.unidade} onChange={handleChange} required>
                                            <option value="">Selecione</option>
                                            <option value="UN">UN - Unidade</option>
                                            <option value="KG">KG - Quilograma</option>
                                            <option value="CX">CX - Caixa</option>
                                            <option value="PC">PC - Peça</option>
                                            <option value="PAR">PAR - Par</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="categoria">Categoria</label>
                                    <select id="categoria" name="categoria" value={formData.categoria} onChange={handleChange} required>
                                        <option value="">Selecione</option>
                                        <option value="TEC">Tecnologia e eletrônico</option>
                                        <option value="MOD">Moda e acessório</option>
                                        <option value="BC">Beleza e cuidado Pessoal</option>
                                        <option value="SBS">Saúde e bem star</option>
                                        <option value="SPT">Esporte e lazer</option>
                                        <option value="SPM">Supermercado</option>
                                        <option value="AUT">Automotivo</option>
                                    </select>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="precoCusto">Preço de Custo (R$)</label>
                                        <input type="number" step="0.01" id="precoCusto" name="precoCusto" value={formData.precoCusto} onChange={handleChange} placeholder="0,00" required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="precoVenda">Preço de Venda (R$)</label>
                                        <input type="number" step="0.01" id="precoVenda" name="precoVenda" value={formData.precoVenda} onChange={handleChange} placeholder="0,00" required />
                                    </div>
                                </div>

                                <div className="form-group full-width">
                                    <label htmlFor="origemProduto">Origem da Mercadoria</label>
                                    <select id="origemProduto" name="origemProduto" value={formData.origemProduto} onChange={handleChange} required>
                                        <option value="0">0 - Nacional (Exceto as indicadas nos códigos 3 a 5)</option>
                                        <option value="1">1 - Estrangeira - Importação direta</option>
                                        <option value="2">2 - Estrangeira - Adquirida no mercado interno</option>
                                        <option value="3">3 - Nacional - Conteúdo de Importação superior a 40%</option>
                                    </select>
                                </div>

                                <div className="form-actions">
                                    <span />
                                    <button type="submit" className="btn-secondary">Salvar Produto</button>
                                    
                                </div>
                            </form>
                        </>
                    )}

                    {/* ABA 2: A TUA TABELA DE PRODUTOS */}
                    {activeTab === 'list' && (
                        <div className="list-container">
                            <h2>Produtos Cadastrados</h2>
                            <p>Selecione um produto na lista para editar ou deletar.</p>
                            
                            {products.length === 0 ? (
                                <p className="empty-message">Nenhum produto encontrado.</p>
                            ) : (
                                <>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th className="checkbox-cell">Sel.</th>
                                                <th>ID</th>
                                                <th>Nome</th>
                                                <th>SKU</th>
                                                <th>Preço Venda</th>
                                                <th>Categoria</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {products.map((prod) => (
                                                <tr key={prod.id} className={formData.id === prod.id ? "selected-row" : ""}>
                                                    <td className="checkbox-cell">
                                                        <input 
                                                            type="checkbox" 
                                                            checked={formData.id === prod.id}
                                                            onChange={() => handleSelect(prod)}
                                                        />
                                                    </td>
                                                    <td>{prod.id}</td>
                                                    <td>{prod.name || prod.nomeProduto}</td>
                                                    <td>{prod.sku}</td>
                                                    <td>R$ {prod.sale_price || prod.precoVenda}</td>
                                                    <td>{prod.category || prod.categoria}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    {/* Botões de Ação para a Tabela (Só aparecem se houver algo selecionado) */}
                                    {formData.id && (
                                        <div className="list-actions">
                                            <button 
                                                type="button" 
                                                className="btn-secondary"
                                                onClick={() => setActiveTab('form')}
                                            >
                                                Editar Selecionado
                                            </button>
                                            <button 
                                                type="button" 
                                                className="btn-terceiro"
                                                onClick={handlerDelete}
                                            >
                                                Deletar Selecionado
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}

                </div>
            </main>

            <Footer />
        </>
    )
}

export default RegisterProduct