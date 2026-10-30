import { useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { apiFetch, getPrincipalType, saveSession } from "../api";
import "./App.css";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  // Estado para controlar se o modal está aberto (true) ou fechado (false)
  const [isModalOpen, setIsModalOpen] = useState(() => {
    const params = new URLSearchParams(location.search);
    return params.get("login") === "required" || Boolean(location.state?.loginRequired);
  });
  const [loginData, setLoginData] = useState({ email: location.state?.registeredEmail || "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  async function handleLogin(event) {
    event.preventDefault();
    setLoginError("");
    setIsLoggingIn(true);
    try {
      const response = await apiFetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData)
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Não foi possível entrar.");
      saveSession(result);
      setIsModalOpen(false);
      const returnTo = new URLSearchParams(location.search).get("returnTo") || location.state?.from?.pathname;
      const defaultRoute = result.principalType === "root" ? "/Gerenciamento" : "/Produtos";
      navigate(returnTo || defaultRoute, { replace: true });
    } catch (error) {
      setLoginError(error.message);
    } finally {
      setIsLoggingIn(false);
    }
  }

  return (
    <>
      <div className="app-container">
        {/* Passamos a função de abrir o modal para dentro do Header */}
        <Header onOpenLogin={() => setIsModalOpen(true)} />

        {/* NOVA SEÇÃO CENTRAL COM HERO E FEATURES */}
        <main className="home-container">
            {/* Seção Principal de Destaque (Hero) */}
            <section className="hero-section">
                <h1>Gestão Inteligente e Estratégica para o seu Negócio</h1>
                <p>Domine o seu estoque, organize a sua esteira de produtos e acelere as suas vendas com uma plataforma completa, rápida e intuitiva.</p>
                <div className="hero-buttons">
                    <Link className="btn-primary" to="/PDV">Abrir PDV</Link>
                    <button className="btn-outline">Conhecer Recursos</button>
                </div>
            </section>

            {/* Seção de Cards (Features) */}
            <section className="features-section">
                <div className="feature-card">
                    <div className="feature-icon">📦</div>
                    <h3>Gerenciamento Estratégico</h3>
                    <p>Cadastro detalhado de produtos com códigos NCM, EAN, margens de lucro e categorização inteligente para máxima organização.</p>
                </div>
                
                <div className="feature-card">
                    <div className="feature-icon">📊</div>
                    <h3>Controle de Estoque</h3>
                    <p>Acompanhe entradas e saídas em tempo real. Evite rupturas, reduza perdas e tome decisões de compra baseadas em dados exatos.</p>
                </div>
                
                <div className="feature-card">
                    <div className="feature-icon">🛒</div>
                    <h3>Tela de Vendas (PDV)</h3>
                    <p>Frente de caixa ágil e intuitiva, integrada diretamente ao seu estoque para realizar vendas rápidas e sem complicações.</p>
                </div>
            </section>
        </main>

        {getPrincipalType() === "root" && (
          <div className="hero-buttons">
            <Link className="btn-outline" to="/Gerenciamento">Gerenciar empresas</Link>
          </div>
        )}

        <Footer />
      </div>

      {/* ESTRUTURA DO MODAL ELEGANTE (MANTIDA INTACTA) */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          {/* o stopPropagation evita que o modal feche ao clicar dentro do formulário */}
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setIsModalOpen(false)}>&times;</button>
            
            <h3>Acesse sua Conta</h3>
            <p className="modal-subtitle">Insira suas credenciais para entrar.</p>
            
            <form className="modal-form" onSubmit={handleLogin}>
              <div className="input-group">
                <label>E-mail cadastrado</label>
                <input type="email" autoComplete="username" value={loginData.email} onChange={(event) => setLoginData({ ...loginData, email: event.target.value })} placeholder="E-mail usado no cadastro" required />
              </div>
              <div className="input-group">
                <label>Senha</label>
                <input type="password" autoComplete="current-password" value={loginData.password} onChange={(event) => setLoginData({ ...loginData, password: event.target.value })} placeholder="••••••••" required />
              </div>
              {loginError && <p role="alert">{loginError}</p>}
              <button type="submit" className="btn-submit" disabled={isLoggingIn}>{isLoggingIn ? "Entrando..." : "Entrar"}</button>
              <p>Empresa nova? <Link to="/Planos" onClick={() => setIsModalOpen(false)}>Conheça os planos</Link></p>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default App;