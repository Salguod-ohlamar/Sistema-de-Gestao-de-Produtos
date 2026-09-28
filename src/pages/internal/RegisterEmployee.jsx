import { useState } from "react"
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import "./Register.css"

function RegisterEmployee() {
    const [formData, setFormData] = useState({
        nomeCompleto: "",
        cpf: "",
        cargo: "",
        isAdmin: false, // Nova flag adicionada ao estado
        email: "",
        telefone: "",
        dataAdmissao: "",
        dataDemissao:""
    })

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        // Se for um checkbox, pegamos o valor de 'checked' (true/false), senão pegamos o 'value'
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log("Dados do colaborador enviados:", formData)
    }

    return (
        <>
            <Header />

            <main className="register-page-container">
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
                                id="nomeCompleto"
                                name="nomeCompleto"
                                value={formData.nomeCompleto}
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
                                    id="cargo"
                                    name="cargo"
                                    value={formData.cargo}
                                    onChange={handleChange}
                                    placeholder="Ex: Desenvolvedor, Gerente"
                                    required
                                >
                                    <option value="0"> Selecione </option>
                                    <option value="1"> Admministração </option>
                                    <option value="2"> Gerencia</option>
                                    <option value="3"> Operacional</option>
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
                            <label htmlFor="dataAdmissao">Data de Admissão</label>
                            <input
                                type="date"
                                id="dataAdmissao"
                                name="dataAdmissao"
                                value={formData.dataAdmissao}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group full-width">
                            <label htmlFor="dataAdmissao">Data de Desligamento</label>
                            <input
                                type="date"
                                id="dataAdmissao"
                                name="dataAdmissao"
                                value={formData.dataDemissao}
                                onChange={handleChange}
                                required
                            />
                        </div>


                        <div className="form-actions">
                            <span />
                            <button type="submit" className="btn-elegant">
                                Confirmar Cadastro
                            </button>

                            <button type="submit" className="btn-elegant">
                                Atualizar Cadastro
                            </button>
                        </div>
                    </form>
                </div>
            </main>

            <Footer />
        </>
    )
}

export default RegisterEmployee
