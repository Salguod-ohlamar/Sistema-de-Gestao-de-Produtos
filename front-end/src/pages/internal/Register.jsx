import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import styles from "./Register.module.css"
import { apiFetch, getPrincipalType } from "../../api"


function Register() {
    const navigate = useNavigate() // 2. Inicialize o hook dentro do componente

    const [formData, setFormData] = useState({
        trade_name: "", legal_name: "", cnpj: "", email: "", phone: "", segment: "", password: ""
    })
    const [errorMessage, setErrorMessage] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrorMessage("")
        setIsSubmitting(true)
        try {
            const response = await apiFetch("/empresas", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            })
            const result = await response.json()
            if (!response.ok) throw new Error(result.error || "Não foi possível cadastrar a empresa.")
            if (getPrincipalType() === "root") {
                navigate("/Gerenciamento")
            } else {
                navigate("/", { state: { loginRequired: true, registeredEmail: result.company.email } })
            }
        } catch (error) {
            setErrorMessage(error.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <>
            <Header />

            <main className={styles.page}>
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
                                name="trade_name"
                                value={formData.trade_name}
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
                                    name="legal_name"
                                    value={formData.legal_name}
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
                                    maxLength="18"
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
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="(00) 00000-0000"
                                    maxLength="15"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group full-width">
                            <label htmlFor="segmento">Segmento de Mercado</label>
                            <select
                                id="segmento"
                                name="segment"
                                value={formData.segment}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Selecione o setor de atuação</option>
                                <option value="technology">Tecnologia e Inovação</option>
                                <option value="retail">Comércio e Varejo</option>
                                <option value="services">Prestação de Serviços</option>
                                <option value="industry">Atividade Industrial</option>
                            </select>
                        </div>

                        <div className="form-group full-width">
                            <label htmlFor="password">Senha da empresa</label>
                            <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} minLength="8" autoComplete="new-password" required />
                        </div>

                        {errorMessage && <p role="alert">{errorMessage}</p>}

                        <div className="form-actions">
                            <button type="submit" className="btn-secondary" disabled={isSubmitting}>
                                {isSubmitting ? "Cadastrando..." : "Confirmar Cadastro"}
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
