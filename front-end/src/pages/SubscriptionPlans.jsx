import { useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import "./SubscriptionPlans.css";

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

function SubscriptionPlans() {
    const [collaborators, setCollaborators] = useState(1);
    const monthlyTotal = 250 + collaborators * 50;

    return (
        <>
            <Header />
            <main className="plans-page">
                <section className="plans-intro">
                    <p className="plans-eyebrow">SGPR · PLANOS</p>
                    <h1>Um plano que acompanha sua equipe.</h1>
                    <p>Implantação assistida e gestão de produtos, estoque e vendas em um só lugar.</p>
                </section>

                <section className="plans-details" aria-labelledby="plan-title">
                    <div className="plan-summary">
                        <span className="plan-label">PLANO SGPR</span>
                        <h2 id="plan-title">Gestão completa</h2>
                        <p>Todos os recursos para organizar a operação da sua empresa.</p>
                        <ul>
                            <li>Cadastro e controle de produtos</li>
                            <li>Estoque com quantidade mínima</li>
                            <li>Frente de caixa integrada</li>
                            <li>Gestão de colaboradores</li>
                        </ul>
                    </div>

                    <div className="plan-pricing">
                        <div className="pricing-row">
                            <span>Implantação, pagamento único</span>
                            <strong>{currency.format(1000)}</strong>
                        </div>
                        <div className="pricing-row monthly-base">
                            <span>Mensalidade base</span>
                            <strong>{currency.format(250)}<small>/mês</small></strong>
                        </div>

                        <label className="collaborator-stepper" htmlFor="plan-collaborators">
                            <span>Colaboradores</span>
                            <span className="stepper-controls">
                                <button type="button" aria-label="Diminuir colaboradores" onClick={() => setCollaborators((count) => Math.max(0, count - 1))}>−</button>
                                <input id="plan-collaborators" type="number" min="0" step="1" value={collaborators} onChange={(event) => setCollaborators(Math.max(0, Number(event.target.value) || 0))} />
                                <button type="button" aria-label="Aumentar colaboradores" onClick={() => setCollaborators((count) => count + 1)}>+</button>
                            </span>
                        </label>
                        <div className="pricing-row per-collaborator">
                            <span>{collaborators} × {currency.format(50)} por colaborador</span>
                            <strong>{currency.format(collaborators * 50)}<small>/mês</small></strong>
                        </div>
                        <div className="monthly-total">
                            <span>Mensalidade estimada</span>
                            <strong>{currency.format(monthlyTotal)}<small>/mês</small></strong>
                        </div>
                        <Link className="plan-cta" to="/Register">Cadastrar minha empresa <span aria-hidden="true">→</span></Link>
                        <p className="plan-note">A implantação é cobrada uma vez. A mensalidade varia conforme o número de colaboradores.</p>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}

export default SubscriptionPlans;