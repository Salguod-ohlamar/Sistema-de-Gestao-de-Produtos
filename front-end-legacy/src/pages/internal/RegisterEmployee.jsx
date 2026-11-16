import { useState } from "react"
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import styles from "./RegisterEmployee.module.css"
import { apiFetch } from "../../api"

function RegisterEmployee() {
    const [formData, setFormData] = useState({
        name: "",
        cpf: "",
        role: "",
        isAdmin: false, // Nova flag adicionada ao estado
        email: "",
        phone: "",
        hire_date: "",
        termination_date: "",
        password: ""
    })
    const [errorMessage, setErrorMessage] = useState("")
    const [successMessage, setSuccessMessage] = useState("")

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        // Se for um checkbox, pegamos o valor de 'checked' (true/false), senão pegamos o 'value'
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrorMessage("")
        setSuccessMessage("")
        try {
            const response = await apiFetch("/colaboradores", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, is_admin: formData.isAdmin })
            })
            const result = await response.json()
            if (!response.ok) throw new Error(result.error || "Não foi possível cadastrar o colaborador.")
            setSuccessMessage(`${result.name} foi cadastrado com acesso ativo.`)
            setFormData({ name: "", cpf: "", role: "", isAdmin: false, email: "", phone: "", hire_date: "", termination_date: "", password: "" })
        } catch (error) {
            setErrorMessage(error.message)
        }
    }

    return (
        <>
            <Header />

            <main className={styles.page}>
                <div className="register-card">
                    <div className="register-header">
                        <h2>Registro e cadastro de Colaboradores</h2>
                        <p>Insira as informações do profissional para integrá-lo ao sistema.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="register-form">

                        <div className="form-group full-width">
                            <label htmlFor="nomeCompleto">Nome Completo</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Nome completo do colaborador"
                                required
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="cpf">CPF</label>
                                <input
                                    type="text"
                                    id="cpf"
                                    name="cpf"
                                    value={formData.cpf}
                                    onChange={handleChange}
                                    placeholder="000.000.000-00"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="cargo">Cargo / Função</label>
                                <select
                                    id="role"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    placeholder="Ex: Desenvolvedor, Gerente"
                                    required
                                >
                                    <option value="">Selecione</option>
                                    <option value="administrator">Administrador</option>
                                    <option value="manager">Gerência</option>
                                    <option value="operator">Operacional</option>
                                </select>
                            </div>
                        </div>

                        {/* NOVA SEÇÃO: Flag de Administrador */}
                        <div className="form-group full-width checkbox-group">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    id="isAdmin"
                                    name="isAdmin"
                                    checked={formData.isAdmin}
                                    onChange={handleChange}
                                />
                                <span>Este colaborador possui privilégios de Administrador</span>
                            </label>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="email">E-mail Pessoal ou Corporativo</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="colaborador@empresa.com"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="telefone">Telefone / Celular</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="(00) 00000-0000"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group full-width">
                            <label htmlFor="dataAdmissao">Data de Admissão</label>
                            <input
                                type="date"
                                id="hire_date"
                                name="hire_date"
                                value={formData.hire_date}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group full-width">
                            <label htmlFor="termination_date">Data de Desligamento</label>
                            <input
                                type="date"
                                id="termination_date"
                                name="termination_date"
                                value={formData.termination_date}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group full-width">
                            <label htmlFor="password">Senha inicial</label>
                            <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} minLength="8" autoComplete="new-password" required />
                        </div>

                        {errorMessage && <p role="alert">{errorMessage}</p>}
                        {successMessage && <p role="status">{successMessage}</p>}


                        <div className="form-actions">
                            <span />
                            <button type="submit" className="btn-elegant">Cadastrar colaborador</button>
                        </div>
                    </form>
                </div>
            </main>

            <Footer />
        </>
    )
}

export default RegisterEmployee
