import { useState } from "react"
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import "./Register.css" // Reaproveita o mesmo CSS estrutural!

function RegisterProduct() {
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
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    //Rota para cadastrar roduto
   const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const response = await fetch("http://localhost:3000/produtos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            const produtoCriado = await response.json(); // Pega o produto retornado com o ID do banco

            // Atualiza o formData incluindo o ID gerado pelo back-end
            setFormData(prev => ({
                ...prev,
                id: produtoCriado.id
            }));

            alert(`Produto salvo com sucesso! ID gerado: ${produtoCriado.id}`);
        } else {
            alert("Erro ao salvar produto.");
        }
    } catch (error) {
        console.error("Erro ao cadastrar:", error);
    }
};

    //Rota para editar
    const handleEdit = async (e) => {

        //dispara a rota de eddição passando o ID 
        const response = await fetch(`http://localhost:3000/produtos/${formData.id}`, {
            method: "PUT",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            alert("Produto atualizado com sucesso")
        }
    }

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
        } else {
            alert(`Erro ao deletar. Servidor respondeu com status: ${response.status}`);
        }
    } catch (error) {
        // Exibe o erro real no Console do Navegador (F12)
        console.error("Erro na comunicação com a API:", error);
    }
};



    return (
        <>
            <Header />

            <main className="register-page-container">
                <div className="register-card">
                    <div className="register-header">
                        <h2>Cadastro de Produto</h2>
                        <p>Insira os dados técnicos e fiscais obrigatórios para a emissão de nota fiscal.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="register-form">

                        {/* Linha 1: Nome do Produto */}
                        <div className="form-group full-width">
                            <label htmlFor="nomeProduto">Nome do Produto / Descrição (NF-e)</label>
                            <input
                                type="text"
                                id="nomeProduto"
                                name="nomeProduto"
                                value={formData.nomeProduto}
                                onChange={handleChange}
                                placeholder="Ex: Camiseta de Algodão Egípcio Preta M"
                                required
                            />
                        </div>

                        {/* Linha 2: SKU e Código de Barras */}
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="sku">SKU (Código Interno)</label>
                                <input
                                    type="text"
                                    id="sku"
                                    name="sku"
                                    value={formData.sku}
                                    onChange={handleChange}
                                    placeholder="Ex: CAM-PRETA-M"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="codigoBarras">Código de Barras / EAN</label>
                                <input
                                    type="text"
                                    id="codigoBarras"
                                    name="codigoBarras"
                                    value={formData.codigoBarras}
                                    onChange={handleChange}
                                    placeholder="7890000000000 (ou 'SEM GTIN')"
                                    required
                                />
                            </div>
                        </div>

                        {/* Linha 3: NCM e Unidade Comercial */}
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="ncm">NCM (8 dígitos fiscais)</label>
                                <input
                                    type="text"
                                    id="ncm"
                                    name="ncm"
                                    value={formData.ncm}
                                    onChange={handleChange}
                                    placeholder="Ex: 6109.10.00"
                                    maxLength="10"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="unidade">Unidade Comercial</label>
                                <select
                                    id="unidade"
                                    name="unidade"
                                    value={formData.unidade}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Selecione</option>
                                    <option value="UN">UN - Unidade</option>
                                    <option value="KG">KG - Quilograma</option>
                                    <option value="CX">CX - Caixa</option>
                                    <option value="PC">PC - Peça</option>
                                    <select value="PAR">PAR - Par</select>
                                </select>
                            </div>


                        </div>
                        <div className="form-group">
                            <label htmlFor="categoria">Categoria</label>
                            <select
                                id="catgoria"
                                name="categoria"
                                value={formData.categoria}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Selecione</option>
                                <option value="TEC">Tecnologia e eletronico</option>
                                <option value="MOD">Moda e acessório</option>
                                <option value="BC">Beleza e cuidado Pessoal</option>
                                <option value="SBS">Saúde e bem star</option>
                                <select value="SPT">Sport e lazer</select>
                                <select value="SPM">Supermercado</select>
                                <select value="AUT">Automotivo</select>
                            </select>
                        </div>
                        {/* Linha 4: Preço de Custo e Preço de Venda */}
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="precoCusto">Preço de Custo (R$)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    id="precoCusto"
                                    name="precoCusto"
                                    value={formData.precoCusto}
                                    onChange={handleChange}
                                    placeholder="0,00"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="precoVenda">Preço de Venda (R$)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    id="precoVenda"
                                    name="precoVenda"
                                    value={formData.precoVenda}
                                    onChange={handleChange}
                                    placeholder="0,00"
                                    required
                                />
                            </div>
                        </div>

                        {/* Linha 5: Origem da Mercadoria (Essencial para cálculo de ICMS na Nota) */}
                        <div className="form-group full-width">
                            <label htmlFor="origemProduto">Origem da Mercadoria</label>
                            <select
                                id="origemProduto"
                                name="origemProduto"
                                value={formData.origemProduto}
                                onChange={handleChange}
                                required
                            >
                                <option value="0">0 - Nacional (Exceto as indicadas nos códigos 3 a 5)</option>
                                <option value="1">1 - Estrangeira - Importação direta</option>
                                <option value="2">2 - Estrangeira - Adquirida no mercado interno</option>
                                <option value="3">3 - Nacional - Conteúdo de Importação superior a 40%</option>
                            </select>
                        </div>

                        {/* Botão de Envio */}
                        <div className="form-actions">
                            <span />
                            <button type="submit" className="btn-secondary">
                                Salvar Produto
                            </button>
                            <button type='button' onClick={handlerDelete} className=".btn-secondary">
                                Deletar Produto
                            </button>
                            <button type="button" onClick={handleEdit} className="btn-secondary">
                                Editar Produto
                            </button>
                        </div>
                    </form>
                </div>
            </main>

            <Footer />

        </>
    )
}

export default RegisterProduct
