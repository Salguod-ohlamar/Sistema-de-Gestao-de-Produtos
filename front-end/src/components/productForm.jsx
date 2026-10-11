import React from 'react';

// Aceitamos propriedades extras (isModal e onCancel) para ajustar o layout dos botões
function ProductForm({ formData, handleChange, handleSubmit, isModal, onCancel,handleEdit }) {
    return (
        <form onSubmit={handleSubmit} className="register-form">
            <div className="form-group full-width">
                <label htmlFor="nomeProduto">Nome do Produto / Descrição (NF-e)</label>
                <input type="text" id="nomeProduto" name="nomeProduto" value={formData.nomeProduto} onChange={handleChange} placeholder="Ex: Camiseta de Algodão Egípcio Preta M" required />
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="sku">SKU (Código Interno)</label>
                    <input type="text" id="sku" name="sku" value={formData.sku} onChange={handleChange} placeholder="Ex: CAM-PRETA-M" required />
                </div>
                <div className="form-group">
                    <label htmlFor="codigoBarras">Código de Barras / EAN</label>
                    <input type="text" id="codigoBarras" name="codigoBarras" value={formData.codigoBarras} onChange={handleChange} placeholder="7890000000000 (ou 'SEM GTIN')" required />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="ncm">NCM (8 dígitos fiscais)</label>
                    <input type="text" id="ncm" name="ncm" value={formData.ncm} onChange={handleChange} placeholder="Ex: 6109.10.00" maxLength="10" required />
                </div>
                <div className="form-group">
                    <label htmlFor="unidade">Unidade Comercial</label>
                    <select id="unidade" name="unidade" value={formData.unidade} onChange={handleChange} required>
                        <option value="">Selecione</option>
                        <option value="UN">UN - Unidade</option>
                        <option value="KG">KG - Quilograma</option>
                        <option value="CX">CX - Caixa</option>
                        <option value="PC">PC - Peça</option>
                        <option value="PAR">PAR - Par</option>
                    </select>
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="categoria">Categoria</label>
                <select id="categoria" name="categoria" value={formData.categoria} onChange={handleChange} required>
                    <option value="">Selecione</option>
                    <option value="TEC">Tecnologia e eletrônico</option>
                    <option value="MOD">Moda e acessório</option>
                    <option value="BC">Beleza e cuidado Pessoal</option>
                    <option value="SBS">Saúde e bem star</option>
                    <option value="SPT">Esporte e lazer</option>
                    <option value="SPM">Supermercado</option>
                    <option value="AUT">Automotivo</option>
                </select>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="precoCusto">Preço de Custo (R$)</label>
                    <input type="number" step="0.01" id="precoCusto" name="precoCusto" value={formData.precoCusto} onChange={handleChange} placeholder="0,00" required />
                </div>
                <div className="form-group">
                    <label htmlFor="precoVenda">Preço de Venda (R$)</label>
                    <input type="number" step="0.01" id="precoVenda" name="precoVenda" value={formData.precoVenda} onChange={handleChange} placeholder="0,00" required />
                </div>
            </div>

            <div className="form-group full-width">
                <label htmlFor="origemProduto">Origem da Mercadoria</label>
                <select id="origemProduto" name="origemProduto" value={formData.origemProduto} onChange={handleChange} required>
                    <option value="0">0 - Nacional (Exceto as indicadas nos códigos 3 a 5)</option>
                    <option value="1">1 - Estrangeira - Importação direta</option>
                    <option value="2">2 - Estrangeira - Adquirida no mercado interno</option>
                    <option value="3">3 - Nacional - Conteúdo de Importação superior a 40%</option>
                </select>
            </div>

            {/* AÇÕES (Botões) - Mudam dinamicamente se estamos no Modal ou não */}
            <div className="form-actions" style={{ justifyContent: isModal ? 'flex-end' : 'flex-end', gap: '15px' }}>
                {isModal && (
                     <button type="button" className="btn-terceiro" onClick={onCancel}>
                        Cancelar
                    </button>
                )}
                <button type="submit" className="btn-secondary" onClick={handleEdit}>
                    {formData.id ? "Atualizar Produto" : "Salvar Produto"}
                </button>
            </div>
        </form>
    );
}

export default ProductForm;