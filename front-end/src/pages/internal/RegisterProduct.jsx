import { useState, useEffect } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ProductForm from "../../components/productForm.jsx";
import "./Register.css";

function RegisterProduct() {
    const [activeTab, setActiveTab] = useState('form');
    const [products, setProducts] = useState([]);
    
    // Estado para controlar a abertura/fecho do Modal
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // Estado do formulário
    const initialFormData = {
        nomeProduto: "", sku: "", codigoBarras: "", ncm: "",
        unidade: "", precoVenda: "", precoCusto: "", origemProduto: "0", categoria: "", id: null
    };
    const [formData, setFormData] = useState(initialFormData);

    // Carregar produtos quando a componente monta ou muda de aba
    useEffect(() => {
        if (activeTab === 'list') {
            fetchProducts();
        }
    }, [activeTab]);

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
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Se tem ID, estamos a editar (pode vir da Aba 1 ou do Modal da Aba 2)
        if (formData.id) {
            return handleEdit();
        }

        // Criar Novo (POST)
        try {
            const response = await fetch("http://localhost:3000/produtos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const produtoCriado = await response.json();
                alert(`Produto salvo com sucesso! ID gerado: ${produtoCriado.id}`);
                setFormData(initialFormData);
                if (activeTab === 'list') fetchProducts(); // Atualiza a lista se estivermos nela
            } else {
                alert("Erro ao salvar produto.");
            }
        } catch (error) {
            console.error("Erro ao cadastrar:", error);
        }
    };

    const handleEdit = async () => {
        try {
            const response = await fetch(`http://localhost:3000/produtos/${formData.id}`, {
                method: "PUT",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert("Produto atualizado com sucesso!");
                setFormData(initialFormData); // Limpa o formulário
                setIsEditModalOpen(false);    // Fecha o modal se estiver aberto
                fetchProducts();              // Recarrega a lista
            } else {
                alert("Erro ao atualizar o produto.");
            }
        } catch (error) {
            console.error("Erro ao comunicar com a API:", error);
        }
    }

    const handlerDelete = async (idToDelete) => {
        // O idToDelete pode vir do clique direto no botão da tabela
        const id = idToDelete || formData.id;
        if (!id) {
            alert("Nenhum produto selecionado para deletar");
            return;
        }

        if(!window.confirm("Tem certeza que deseja deletar este produto?")) return;

        try {
            const response = await fetch(`http://localhost:3000/produtos/${id}`, {
                method: "DELETE"
            });

            if (response.ok) {
                alert("Produto deletado com sucesso!");
                if (formData.id === id) setFormData(initialFormData);
                fetchProducts();
            } else {
                alert(`Erro ao deletar. Status: ${response.status}`);
            }
        } catch (error) {
            console.error("Erro na comunicação:", error);
        }
    };

    // Função disparada ao clicar em "Editar" direto na tabela (Abre o Modal)
    const openEditModal = (prod) => {
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
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setFormData(initialFormData); // Limpa ao fechar
    };

    const handleMudarAba = (tab) => {
        setActiveTab(tab);
        setFormData(initialFormData); // Limpa os dados ao mudar de aba
    };

    return (
        <>
            <Header />

            <main className="register-page-container">
                <div className="register-card">

                    {/* Botões das Abas */}
                    <div className="tabs-container">
                        <button
                            type="button"
                            className={`tab-button ${activeTab === 'form' ? 'active' : ''}`}
                            onClick={() => handleMudarAba('form')}
                        >
                            Cadastrar Produto
                        </button>
                        <button
                            type="button"
                            className={`tab-button ${activeTab === 'list' ? 'active' : ''}`}
                            onClick={() => handleMudarAba('list')}
                        >
                            Visualizar Produtos
                        </button>
                    </div>

                    {/* Aba 1: Formulário (Modo Criação) */}
                    {activeTab === 'form' && (
                        <div className="tab-content">
                             <div className="register-header">
                                <h2>Cadastro de Produto</h2>
                                <p>Insira os dados técnicos e fiscais obrigatórios.</p>
                            </div>
                            <ProductForm
                                formData={formData}
                                handleChange={handleChange}
                                handleSubmit={handleSubmit}
                            />
                        </div>
                    )}

                    {/* Aba 2: Lista de Produtos */}
                    {activeTab === 'list' && (
                        <div className="list-container">
                            <h2>Produtos Cadastrados</h2>
                            <p>Lista dos produtos disponíveis na base de dados.</p>

                            {products.length === 0 ? (
                                <p className="empty-message">Nenhum produto encontrado.</p>
                            ) : (
                                <table>
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Nome</th>
                                            <th>SKU</th>
                                            <th>Preço Venda</th>
                                            <th className="actions-cell">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.map((prod) => (
                                            <tr key={prod.id}>
                                                <td>{prod.id}</td>
                                                <td>{prod.name || prod.nomeProduto}</td>
                                                <td>{prod.sku}</td>
                                                <td>R$ {prod.sale_price || prod.precoVenda}</td>
                                                <td className="actions-cell">
                                                    <button 
                                                        className="btn-secondary"
                                                        onClick={() => openEditModal(prod)}
                                                    >
                                                        Editar
                                                    </button>
                                                    <button 
                                                        className="btn-secondary"
                                                        onClick={() => handlerDelete(prod.id)}
                                                    >
                                                        Deletar
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}

                </div>
            </main>

            {/* MODAL DE EDIÇÃO (Aparece por cima da tela) */}
            {isEditModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>Editar Produto (ID: {formData.id})</h2>
                            <button className="modal-close" onClick={closeEditModal}>&times;</button>
                        </div>
                        <div className="modal-body">
                            <ProductForm
                                formData={formData}
                                handleChange={handleChange}
                                handleSubmit={handleSubmit}
                                isModal={true} /* Prop extra para o componente saber se está no modal */
                                onCancel={closeEditModal}
                            />
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </>
    );
}

export default RegisterProduct;