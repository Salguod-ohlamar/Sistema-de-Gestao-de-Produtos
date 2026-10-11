import { useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import "./App.css";

function App() {
  // Estado para controlar se o modal está aberto (true) ou fechado (false)
  const [isModalOpen, setIsModalOpen] = useState(false);

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
                    <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
                        Começar Agora
                    </button>
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
            
            <form className="modal-form">
              <div className="input-group">
                <label>E-mail</label>
                <input type="email" placeholder="seu@email.com" required />
              </div>
              <div className="input-group">
                <label>Senha</label>
                <input type="password" placeholder="••••••••" required />
              </div>
              <button type="submit" className="btn-submit">Entrar</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default App;