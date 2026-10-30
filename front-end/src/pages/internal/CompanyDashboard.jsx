import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import { apiFetch, getPrincipalType } from "../../api";
import styles from "./CompanyDashboard.module.css";

const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const roles = { administrator: "Administrador", manager: "Gerente", operator: "Operador" };

function formatDate(value) {
    if (!value) return "-";
    return new Intl.DateTimeFormat("pt-BR", { dateStyle: "long", timeZone: "UTC" }).format(new Date(value));
}

function Speedometer({ value, label, detail }) {
    const safeValue = Math.min(100, Math.max(0, Number(value) || 0));
    const angle = Math.PI - (safeValue / 100) * Math.PI;
    const needleX = 80 + Math.cos(angle) * 48;
    const needleY = 80 - Math.sin(angle) * 48;

    return (
        <div className={styles.gauge}>
            <svg viewBox="0 0 160 96" role="img" aria-label={`${label}: ${safeValue}%`}>
                <path d="M 24 80 A 56 56 0 0 1 52 31.5" className={styles.gaugeRed} />
                <path d="M 52 31.5 A 56 56 0 0 1 108 31.5" className={styles.gaugeYellow} />
                <path d="M 108 31.5 A 56 56 0 0 1 136 80" className={styles.gaugeBlue} />
                <path d={`M 80 80 L ${needleX} ${needleY}`} className={styles.gaugeNeedle} />
                <circle cx="80" cy="80" r="5" className={styles.gaugeHub} />
                <text x="19" y="94">0</text>
                <text x="132" y="94">100</text>
            </svg>
            <strong>{safeValue}%</strong>
            <span>{label}</span>
            <small>{detail}</small>
        </div>
    );
}

async function getJson(path) {
    const response = await apiFetch(path);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Não foi possível carregar as informações.");
    return data;
}

function CompanyDashboard() {
    const [activeTab, setActiveTab] = useState("overview");
    const [overview, setOverview] = useState(null);
    const [collaborators, setCollaborators] = useState([]);
    const [billing, setBilling] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [updatingCollaboratorId, setUpdatingCollaboratorId] = useState(null);

    useEffect(() => {
        let isCurrent = true;
        Promise.all([
            getJson("/empresa/dashboard"),
            getJson("/empresa/colaboradores"),
            getJson("/empresa/financeiro")
        ])
            .then(([companyOverview, team, companyBilling]) => {
                if (!isCurrent) return;
                setOverview(companyOverview);
                setCollaborators(team);
                setBilling(companyBilling);
            })
            .catch((error) => {
                if (isCurrent) setErrorMessage(error.message);
            })
            .finally(() => {
                if (isCurrent) setIsLoading(false);
            });

        return () => { isCurrent = false; };
    }, []);

    async function toggleCollaborator(collaborator) {
        const nextActive = !collaborator.is_active;
        setUpdatingCollaboratorId(collaborator.id);
        setErrorMessage("");
        try {
            const response = await apiFetch(`/empresa/colaboradores/${collaborator.id}/ativo`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ is_active: nextActive })
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || "Não foi possível atualizar o colaborador.");
            setCollaborators((current) => current.map((person) => person.id === collaborator.id ? { ...person, is_active: result.is_active } : person));
            setOverview((current) => ({
                ...current,
                active_collaborator_count: Number(current.active_collaborator_count) + (nextActive ? 1 : -1)
            }));
            setBilling((current) => ({
                ...current,
                active_collaborator_count: Number(current.active_collaborator_count) + (nextActive ? 1 : -1),
                estimated_monthly_amount: 250 + (Number(current.active_collaborator_count) + (nextActive ? 1 : -1)) * 50,
                estimated_contract_total: 1000 + (250 + (Number(current.active_collaborator_count) + (nextActive ? 1 : -1)) * 50) * Number(current.plan_term_months || 0)
            }));
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setUpdatingCollaboratorId(null);
        }
    }

    const canManageTeam = getPrincipalType() === "company" ||
        localStorage.getItem("sgpr_session_is_admin") === "true" ||
        localStorage.getItem("sgpr_session_role") === "administrator";
    const activeCount = Number(overview?.active_collaborator_count || 0);
    const currentTermTotal = billing?.estimated_contract_total ?? 0;
    const nextDue = billing?.next_due_date;

    return (
        <>
            <Header />
            <main className={styles.page}>
                <section className={styles.heading}>
                    <div>
                        <p className={styles.eyebrow}>ÁREA DA EMPRESA</p>
                        <h1>{overview?.trade_name || "Painel da empresa"}</h1>
                        <p>Estoque, equipe e acompanhamento do plano em um só lugar.</p>
                    </div>
                    <Link to="/Produtos" className={styles.productLink}>Gerenciar produtos <span aria-hidden="true">↗</span></Link>
                </section>

                <nav className={styles.tabs} aria-label="Áreas do painel">
                    <button type="button" className={activeTab === "overview" ? styles.selectedTab : ""} onClick={() => setActiveTab("overview")}>Visão geral</button>
                    <button type="button" className={activeTab === "team" ? styles.selectedTab : ""} onClick={() => setActiveTab("team")}>Equipe <span>{overview?.collaborator_count ?? 0}</span></button>
                    <button type="button" className={activeTab === "billing" ? styles.selectedTab : ""} onClick={() => setActiveTab("billing")}>Financeiro</button>
                </nav>

                {errorMessage && <p className={styles.error} role="alert">{errorMessage}</p>}
                {isLoading && <p className={styles.loading}>Carregando dados da empresa...</p>}

                {!isLoading && overview && activeTab === "overview" && (
                    <>
                        <section className={styles.gauges} aria-label="Indicadores de estoque">
                            <Speedometer value={overview.stock_health_percent} label="Saúde do estoque" detail={`${overview.critical_product_count} produtos no mínimo ou abaixo`} />
                            <Speedometer value={overview.minimum_coverage_percent} label="Cobertura dos mínimos" detail="Unidades disponíveis em relação ao estoque mínimo" />
                        </section>
                        <section className={styles.metricGrid}>
                            <article className={styles.metric}><span>Produtos cadastrados</span><strong>{overview.product_count}</strong></article>
                            <article className={styles.metric}><span>Unidades em estoque</span><strong>{Number(overview.stock_units).toLocaleString("pt-BR")}</strong></article>
                            <article className={styles.metric}><span>Valor de custo do estoque</span><strong>{money.format(Number(overview.stock_cost_value))}</strong></article>
                            <article className={styles.metric}><span>Valor potencial de venda</span><strong>{money.format(Number(overview.stock_sale_value))}</strong></article>
                        </section>
                        <section className={styles.lowStock}>
                            <header><h2>Produtos em nível crítico</h2><span>{overview.low_stock_products.length}</span></header>
                            {overview.low_stock_products.length ? (
                                <div className={styles.lowStockList}>
                                    {overview.low_stock_products.slice(0, 6).map((product) => (
                                        <div key={product.id} className={styles.lowStockRow}>
                                            <strong>{product.name}</strong>
                                            <span>{product.sku}</span>
                                            <span>{product.stock_quantity} / {product.min_stock_quantity} un.</span>
                                        </div>
                                    ))}
                                </div>
                            ) : <p className={styles.empty}>Nenhum produto no mínimo ou abaixo.</p>}
                        </section>
                    </>
                )}

                {!isLoading && activeTab === "team" && (
                    <section className={styles.teamSection}>
                        <header className={styles.sectionHeader}>
                            <div><h2>Colaboradores</h2><p>{activeCount} ativos de {collaborators.length}</p></div>
                            {canManageTeam && <Link to="/Colaborador" className={styles.primaryButton}>Cadastrar colaborador <span aria-hidden="true">+</span></Link>}
                        </header>
                        {!collaborators.length ? <p className={styles.empty}>Nenhum colaborador cadastrado.</p> : (
                            <div className={styles.teamList}>
                                {collaborators.map((person) => (
                                    <div key={person.id} className={styles.teamRow}>
                                        <div><strong>{person.name}</strong><span>{person.email}</span></div>
                                        <span className={styles.role}>{roles[person.role] || person.role}</span>
                                        <span className={`${styles.status} ${person.is_active ? styles.active : styles.inactive}`}>{person.is_active ? "Ativo" : "Inativo"}</span>
                                        {canManageTeam && <label className={styles.activeToggle}>
                                            <input type="checkbox" checked={person.is_active} disabled={updatingCollaboratorId === person.id} onChange={() => toggleCollaborator(person)} />
                                            <span>{person.is_active ? "Acesso ativo" : "Acesso desativado"}</span>
                                        </label>}
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                )}

                {!isLoading && billing && activeTab === "billing" && (
                    <section className={styles.billingSection}>
                        <header className={styles.sectionHeader}>
                            <div><h2>Financeiro</h2><p>Valores e período vinculados somente a esta empresa.</p></div>
                            <span className={styles.readOnlyTag}>Previsão contratual</span>
                        </header>
                        {billing.plan_code ? (
                            <>
                                <div className={styles.billingGrid}>
                                    <article><span>Plano</span><strong>Gestão completa</strong></article>
                                    <article><span>Colaboradores ativos</span><strong>{billing.active_collaborator_count}</strong></article>
                                    <article><span>Mensalidade estimada</span><strong>{money.format(Number(billing.estimated_monthly_amount))}<small>/mês</small></strong></article>
                                    <article><span>Próximo vencimento estimado</span><strong>{formatDate(nextDue)}</strong></article>
                                    <article><span>Início do contrato</span><strong>{formatDate(billing.plan_started_at)}</strong></article>
                                    <article><span>Fim do contrato</span><strong>{formatDate(billing.plan_end_date)}</strong></article>
                                </div>
                                <div className={styles.contractTotal}><span>Total estimado do período ({billing.plan_term_months} meses, incluindo implantação)</span><strong>{money.format(Number(currentTermTotal))}</strong></div>
                                <p className={styles.billingNote}>Esta tela apresenta a previsão do plano. Nenhum pagamento ou quitação é registrado por ela.</p>
                            </>
                        ) : (
                            <div className={styles.noPlan}><h3>Nenhum plano atribuído</h3><p>Entre em contato com a administração para configurar o período e os valores do plano da empresa.</p></div>
                        )}
                    </section>
                )}
            </main>
            <Footer />
        </>
    );
}

export default CompanyDashboard;