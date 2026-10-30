import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import { apiFetch } from "../../api";
import styles from "./AdminManagement.module.css";

const roleNames = {
    administrator: "Administrador",
    manager: "Gerente",
    operator: "Operador"
};
const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

function formatDate(value) {
    if (!value) return "-";
    return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeZone: "UTC" }).format(new Date(value));
}

function AdminManagement() {
    const [companies, setCompanies] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [planTerms, setPlanTerms] = useState({});
    const [savingPlanId, setSavingPlanId] = useState(null);

    useEffect(() => {
        let isActive = true;
        apiFetch("/admin/companies")
            .then(async (response) => {
                const data = await response.json();
                if (!response.ok) throw new Error(data.error || "Acesso não autorizado.");
                if (isActive) setCompanies(data);
            })
            .catch((error) => {
                if (isActive) setErrorMessage(error.message);
            })
            .finally(() => {
                if (isActive) setIsLoading(false);
            });

        return () => {
            isActive = false;
        };
    }, []);

    async function updateActive(path, isActive, updateCompany) {
        setErrorMessage("");
        try {
            const response = await apiFetch(path, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ is_active: isActive })
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || "Não foi possível atualizar o status.");
            setCompanies((current) => current.map(updateCompany));
        } catch (error) {
            setErrorMessage(error.message);
        }
    }

    function toggleCompany(company) {
        const nextActive = !company.is_active;
        updateActive(`/admin/companies/${company.id}/active`, nextActive, (item) =>
            item.id === company.id ? { ...item, is_active: nextActive } : item);
    }

    function toggleCollaborator(company, collaborator) {
        const nextActive = !collaborator.is_active;
        updateActive(`/admin/collaborators/${collaborator.id}/active`, nextActive, (item) =>
            item.id === company.id
                ? {
                    ...item,
                    active_collaborator_count: Number(item.active_collaborator_count) + (nextActive ? 1 : -1),
                    collaborators: item.collaborators.map((person) => person.id === collaborator.id ? { ...person, is_active: nextActive } : person)
                }
                : item);
    }

    async function assignPlan(company) {
        const termMonths = Number(planTerms[company.id] || 12);
        setSavingPlanId(company.id);
        setErrorMessage("");
        try {
            const response = await apiFetch(`/admin/companies/${company.id}/plan`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ term_months: termMonths })
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || "Não foi possível atribuir o plano.");
            setCompanies((current) => current.map((item) => item.id === company.id ? { ...item, ...result } : item));
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setSavingPlanId(null);
        }
    }

    const collaboratorTotal = companies.reduce((sum, company) => sum + Number(company.collaborator_count || 0), 0);

    return (
        <>
            <Header />
            <main className={styles.page}>
                <section className={styles.heading}>
                    <div>
                        <p className={styles.eyebrow}>ADMINISTRAÇÃO CENTRAL</p>
                        <h1>Empresas e acessos</h1>
                        <p>Consulte as empresas cadastradas e gerencie quem pode acessar o sistema.</p>
                    </div>
                    <Link className={styles.addCompany} to="/Register">Cadastrar empresa <span aria-hidden="true">+</span></Link>
                </section>

                <section className={styles.summary} aria-label="Resumo">
                    <div><span>Empresas</span><strong>{companies.length}</strong></div>
                    <div><span>Colaboradores associados</span><strong>{collaboratorTotal}</strong></div>
                    <div><span>Empresas ativas</span><strong>{companies.filter((company) => company.is_active).length}</strong></div>
                </section>

                {errorMessage && <p className={styles.error} role="alert">{errorMessage}</p>}
                {isLoading && <p className={styles.empty}>Carregando empresas...</p>}
                {!isLoading && !errorMessage && companies.length === 0 && <p className={styles.empty}>Nenhuma empresa cadastrada.</p>}

                <div className={styles.companyList}>
                    {companies.map((company) => (
                        <section className={styles.company} key={company.id}>
                            <header className={styles.companyHeader}>
                                <div className={styles.companyIdentity}>
                                    <span className={styles.companyMark} aria-hidden="true">{company.trade_name.slice(0, 1).toUpperCase()}</span>
                                    <div>
                                        <h2>{company.trade_name}</h2>
                                        <p>{company.legal_name} · CNPJ {company.cnpj}</p>
                                        <small>{company.email} · {company.phone}</small>
                                    </div>
                                </div>
                                <div className={styles.companyControls}>
                                    <span className={`${styles.status} ${company.is_active ? styles.active : styles.inactive}`}>
                                        {company.is_active ? "Ativa" : "Inativa"}
                                    </span>
                                    <label className={styles.toggle}>
                                        <input type="checkbox" checked={company.is_active} onChange={() => toggleCompany(company)} aria-label={`${company.is_active ? "Desativar" : "Ativar"} empresa ${company.trade_name}`} />
                                        <span />
                                    </label>
                                </div>
                            </header>

                            <div className={styles.peopleHeading}>
                                <h3>Colaboradores</h3>
                                <span>{company.collaborator_count}</span>
                                <small>{company.active_collaborator_count || 0} ativos</small>
                            </div>

                            {company.collaborators.length === 0 ? (
                                <p className={styles.noPeople}>Nenhum colaborador associado.</p>
                            ) : (
                                <div className={styles.peopleList}>
                                    {company.collaborators.map((person) => (
                                        <div className={styles.person} key={person.id}>
                                            <div className={styles.personIdentity}>
                                                <strong>{person.name}</strong>
                                                <span>{person.email}</span>
                                            </div>
                                            <span className={styles.role}>{roleNames[person.role] || person.role}</span>
                                            {person.is_admin && <span className={styles.adminTag}>Admin da empresa</span>}
                                            <label className={styles.personToggle}>
                                                <input type="checkbox" checked={person.is_active} onChange={() => toggleCollaborator(company, person)} aria-label={`${person.is_active ? "Desativar" : "Ativar"} ${person.name}`} />
                                                <span>{person.is_active ? "Ativo" : "Inativo"}</span>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className={styles.planSection}>
                                <div className={styles.planHeader}>
                                    <div>
                                        <h3>Plano contratado</h3>
                                        <p>Implantação única de R$ 1.000,00 · mensalidade base de R$ 250,00 · R$ 50,00 por colaborador ativo</p>
                                    </div>
                                    {company.plan_code && <span className={styles.planBadge}>Gestão completa</span>}
                                </div>

                                {company.plan_code ? (
                                    <>
                                        <div className={styles.planFacts}>
                                            <div><span>Prazo contratado</span><strong>{company.plan_term_months} meses</strong></div>
                                            <div><span>Início</span><strong>{formatDate(company.plan_started_at)}</strong></div>
                                            <div><span>Término previsto</span><strong>{formatDate(company.plan_end_date)}</strong></div>
                                            <div><span>Colaboradores ativos</span><strong>{company.active_collaborator_count}</strong></div>
                                        </div>
                                        <div className={styles.planTotals}>
                                            <div><span>Mensalidade estimada</span><strong>{currency.format(250 + Number(company.active_collaborator_count || 0) * 50)}<small>/mês</small></strong></div>
                                            <div><span>Total estimado do período</span><strong>{currency.format(1000 + (250 + Number(company.active_collaborator_count || 0) * 50) * Number(company.plan_term_months || 0))}</strong></div>
                                        </div>
                                    </>
                                ) : (
                                    <div className={styles.assignPlan}>
                                        <label htmlFor={`term-${company.id}`}>Prazo do plano em meses
                                            <input
                                                id={`term-${company.id}`}
                                                type="number"
                                                min="1"
                                                max="120"
                                                step="1"
                                                value={planTerms[company.id] ?? 12}
                                                onChange={(event) => setPlanTerms((current) => ({ ...current, [company.id]: event.target.value }))}
                                            />
                                        </label>
                                        <div className={styles.assignEstimate}>
                                            <span>Mensalidade: {currency.format(250 + Number(company.active_collaborator_count || 0) * 50)}</span>
                                            <strong>Previsão: {currency.format(1000 + (250 + Number(company.active_collaborator_count || 0) * 50) * Number(planTerms[company.id] || 12))}</strong>
                                        </div>
                                        <button className={styles.assignButton} type="button" onClick={() => assignPlan(company)} disabled={savingPlanId === company.id}>
                                            {savingPlanId === company.id ? "Atribuindo..." : "Atribuir plano"}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </section>
                    ))}
                </div>
            </main>
            <Footer />
        </>
    );
}

export default AdminManagement;