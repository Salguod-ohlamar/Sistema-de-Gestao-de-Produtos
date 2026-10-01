import { useState } from "react"
import { Link, useNavigate } from "react-router-dom" // 1. Importe o hook de navegação
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import "./Register.css"


function Register() {
    const navigate = useNavigate() // 2. Inicialize o hook dentro do componente

    const [formData, setFormData] = useState({
        nomeFantasia: "",
        razaoSocial: "",
        cnpj: "",
        email: "",
        telefone: "",
        segmento: ""
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log("Dados da empresa enviados:", formData)
    }

    // 3. Atualize a função para mudar de página ao clicar
    const handleAdminClick = () => {
        // Altere "/registrar-colaborador" para o caminho exato que você definiu nas rotas do seu App.jsx
        navigate("/RegisterEmployee") 
    }

    return (
        <>
            <Header />

            <main className="register-page-container">
                <div className="register-card">
                    <div className="register-header">
                        <h2>Registro e cadastro de Empresas</h2>
                        <p>Preencha os campos abaixo com as informações corporativas oficiais.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="register-form">
                        <div className="form-group full-width">
                            <label htmlFor="nomeFantasia">Nome Fantasia</label>
                            <input
                                type="text"
                                id="nomeFantasia"
                                name="nomeFantasia"
                                value={formData.nomeFantasia}
                                onChange={handleChange}
                                placeholder="Nome comercial da empresa"
                                required
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="razaoSocial">Razão Social</label>
                                <input
                                    type="text"
                                    id="razaoSocial"
                                    name="razaoSocial"
                                    value={formData.razaoSocial}
                                    onChange={handleChange}
                                    placeholder="Razão social jurídica"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="cnpj">CNPJ</label>
                                <input
                                    type="text"
                                    id="cnpj"
                                    name="cnpj"
                                    value={formData.cnpj}
                                    onChange={handleChange}
                                    placeholder="00.000.000/0001-00"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="email">E-mail de Contato</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="exemplo@empresa.com"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="telefone">Telefone Corporativo</label>
                                <input
                                    type="tel"
                                    id="telefone"
                                    name="telefone"
                                    value={formData.telefone}
                                    onChange={handleChange}
                                    placeholder="(00) 00000-0000"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group full-width">
                            <label htmlFor="segmento">Segmento de Mercado</label>
                            <select
                                id="segmento"
                                name="segmento"
                                value={formData.segmento}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Selecione o setor de atuação</option>
                                <option value="tecnologia">Tecnologia e Inovação</option>
                                <option value="comercio">Comércio e Varejo</option>
                                <option value="servicos">Prestação de Serviços</option>
                                <option value="industria">Atividade Industrial</option>
                            </select>
                        </div>

                        <div className="form-actions">
                            <button type="button" className="btn-secondary" onClick={handleAdminClick}>
                                Confirmar Administrador
                            </button>
                            
                            <button type="submit" className="btn-secondary">
                                Confirmar Cadastro
                            </button>
                        </div>
                    </form>
                </div>
            </main>

            <Footer />
        </>
    )
}

export default Register
