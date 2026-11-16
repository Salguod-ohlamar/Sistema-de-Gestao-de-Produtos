import style from './Header.module.css';
import { Link } from 'react-router-dom';
import { getPrincipalType } from '../api';

// Recebemos a função onOpenLogin como propriedade (prop)
function Header({ onOpenLogin }) {
    const principalType = getPrincipalType();

    return (
        <header className={style['main-header']}>
            <div className={style['header-container']}>
                <a href="#" className={style.logo}>Meu<span>Logo</span></a>

                <nav className={style['nav-menu']}>
                    <ul>
                        <li><Link to="/">Início</Link></li>
                        <li><Link to="/PDV">PDV</Link></li>
                        <li><Link to="/Produtos">Produtos</Link></li>
                        <li><Link to="/PainelEmpresa">Minha empresa</Link></li>
                        <li><Link to="/Register">Empresas</Link></li>
                        {principalType === 'root' && <li><Link to="/Gerenciamento">Gerenciamento</Link></li>}
                        <li><a href="#">Sobre</a></li>
                        <li><a href="#">Serviços</a></li>
                        <li><a href="#">Contato</a></li>
                    </ul>
                </nav>

                <div className={style['header-cta']}>
                    {['company', 'collaborator'].includes(principalType) ? (
                        <Link to="/PainelEmpresa" className={style['btn-elegant']}>Minha empresa</Link>
                    ) : principalType === 'root' ? (
                        <Link to="/Gerenciamento" className={style['btn-elegant']}>Gerenciamento</Link>
                    ) : (
                        <button onClick={onOpenLogin} className={style['btn-elegant']}>Entrar</button>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;
