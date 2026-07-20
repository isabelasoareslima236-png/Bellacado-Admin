import { useState, useEffect } from 'react';
import { db, auth } from './firebaseConfig';
import {
  collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, query, orderBy,
} from 'firebase/firestore';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import {
  Plus, Trash2, Pencil, Check, Package, ShoppingBag, Eye, EyeOff, Lock, LogOut,
} from 'lucide-react';

const COLORS = {
  green: '#2F3D2E',
  sage: '#A5B197',
  pink: '#E7C9C6',
  cream: '#F7EDE6',
  sand: '#DCCFC3',
};

const FontImport = () => (
  <style>{`@import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Poppins:wght@400;500;600;700&display=swap');
  * { box-sizing: border-box; } body { margin: 0; }`}</style>
);

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError('E-mail ou senha incorretos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: COLORS.cream, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Poppins', sans-serif", padding: 24 }}>
      <FontImport />
      <div style={{ background: '#fff', borderRadius: 20, padding: '40px 32px', maxWidth: 360, width: '100%', boxShadow: '0 8px 30px rgba(47,61,46,0.10)', textAlign: 'center' }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: COLORS.pink, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
          <Lock size={24} color={COLORS.green} />
        </div>
        <h1 style={{ fontFamily: "'Dancing Script', cursive", color: COLORS.green, fontSize: 34, margin: '0 0 4px' }}>Bella Cadô</h1>
        <p style={{ color: '#8a8378', fontSize: 13, margin: '0 0 24px', letterSpacing: 0.3 }}>PAINEL ADMINISTRATIVO</p>
        <form onSubmit={submit}>
          <input
            type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="E-mail" autoFocus
            style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: `1.5px solid ${COLORS.sand}`, fontSize: 14, marginBottom: 10, outline: 'none', background: COLORS.cream, color: COLORS.green }}
          />
          <input
            type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
            style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: `1.5px solid ${COLORS.sand}`, fontSize: 14, marginBottom: 12, outline: 'none', background: COLORS.cream, color: COLORS.green }}
          />
          {error && <p style={{ color: '#c1594a', fontSize: 13, margin: '0 0 12px' }}>{error}</p>}
          <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', borderRadius: 12, border: 'none', background: COLORS.green, color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <p style={{ fontSize: 11, color: '#b2ab9f', marginTop: 20 }}>Crie seu usuário admin no Firebase Console → Authentication.</p>
      </div>
    </div>
  );
}

function ProductForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || { name: '', description: '', price: '', category: 'Geral', image: '', active: true });
  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.price) return;
    onSave({ ...form, price: parseFloat(String(form.price).replace(',', '.')) || 0 });
  };

  const inputStyle = { width: '100%', padding: '10px 12px', borderRadius: 10, border: `1.5px solid ${COLORS.sand}`, fontSize: 14, marginBottom: 12, outline: 'none', fontFamily: "'Poppins', sans-serif", color: COLORS.green, background: '#fff' };
  const labelStyle = { fontSize: 12, fontWeight: 600, color: '#8a8378', marginBottom: 4, display: 'block' };

  return (
    <form onSubmit={submit} style={{ background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 4px 20px rgba(47,61,46,0.08)' }}>
      <label style={labelStyle}>Nome do produto</label>
      <input style={inputStyle} value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Ex: Kit Papai Estiloso" />
      <label style={labelStyle}>Descrição</label>
      <textarea style={{ ...inputStyle, minHeight: 70, resize: 'vertical' }} value={form.description} onChange={(e) => update('description', e.target.value)} placeholder="Conte o que vem no kit..." />
      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Preço (R$)</label>
          <input style={inputStyle} value={form.price} onChange={(e) => update('price', e.target.value)} placeholder="89,90" />
        </div>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Categoria</label>
          <input style={inputStyle} value={form.category} onChange={(e) => update('category', e.target.value)} placeholder="Ex: Dia dos Pais" />
        </div>
      </div>
      <label style={labelStyle}>Link da foto (ex: do ImgBB)</label>
      <input style={inputStyle} value={form.image} onChange={(e) => update('image', e.target.value)} placeholder="https://i.ibb.co/..." />
      <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: COLORS.green, marginBottom: 16, cursor: 'pointer' }}>
        <input type="checkbox" checked={form.active} onChange={(e) => update('active', e.target.checked)} />
        Produto visível no catálogo
      </label>
      <div style={{ display: 'flex', gap: 10 }}>
        <button type="submit" style={{ flex: 1, padding: '11px', borderRadius: 10, border: 'none', background: COLORS.green, color: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <Check size={16} /> Salvar
        </button>
        <button type="button" onClick={onCancel} style={{ flex: 1, padding: '11px', borderRadius: 10, border: `1.5px solid ${COLORS.sand}`, background: '#fff', color: '#8a8378', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
          Cancelar
        </button>
      </div>
    </form>
  );
}

function Dashboard() {
  const [tab, setTab] = useState('produtos');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'products'),
      (snap) => { setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() }))); setLoading(false); },
      (err) => { setError('Erro ao carregar produtos: ' + err.message); setLoading(false); }
    );
    return unsub;
  }, []);

  useEffect(() => {
    const q = query(collection(db, 'orders'), orderBy('date', 'desc'));
    const unsub = onSnapshot(q, (snap) => setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() }))));
    return unsub;
  }, []);

  const handleCreate = async (data) => {
    try {
      await addDoc(collection(db, 'products'), data);
      setCreating(false);
    } catch (err) {
      setError('Erro ao criar: ' + err.message);
    }
  };

  const handleUpdate = async (data) => {
    try {
      await updateDoc(doc(db, 'products', editing.id), data);
      setEditing(null);
    } catch (err) {
      setError('Erro ao atualizar: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (err) {
      setError('Erro ao excluir: ' + err.message);
    }
  };

  const toggleActive = async (p) => {
    try {
      await updateDoc(doc(db, 'products', p.id), { active: !p.active });
    } catch (err) {
      setError('Erro ao atualizar: ' + err.message);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: COLORS.cream, fontFamily: "'Poppins', sans-serif" }}>
      <FontImport />
      <div style={{ background: COLORS.green, padding: '20px 20px 0', borderRadius: '0 0 24px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontFamily: "'Dancing Script', cursive", color: '#fff', fontSize: 30, margin: '0 0 2px' }}>Bella Cadô</h1>
            <p style={{ color: COLORS.sage, fontSize: 12, margin: '0 0 16px', letterSpacing: 0.5 }}>PAINEL ADMINISTRATIVO</p>
          </div>
          <button onClick={() => signOut(auth)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, marginTop: 4 }} title="Sair">
            <LogOut size={18} color={COLORS.sage} />
          </button>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {[{ id: 'produtos', label: 'Produtos', icon: Package }, { id: 'pedidos', label: 'Pedidos', icon: ShoppingBag }].map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, background: tab === t.id ? COLORS.cream : 'transparent', border: 'none', borderRadius: '12px 12px 0 0', padding: '10px 0', color: tab === t.id ? COLORS.green : COLORS.sage, fontWeight: 600, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <t.icon size={15} /> {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: 20, maxWidth: 520, margin: '0 auto' }}>
        {error && <div style={{ background: '#fbe4e0', color: '#c1594a', padding: '10px 14px', borderRadius: 10, fontSize: 13, marginBottom: 14 }}>{error}</div>}

        {tab === 'produtos' && (
          <>
            {!creating && !editing && (
              <button onClick={() => setCreating(true)} style={{ width: '100%', padding: '13px', borderRadius: 12, border: `1.5px dashed ${COLORS.sage}`, background: '#fff', color: COLORS.green, fontWeight: 600, fontSize: 14, cursor: 'pointer', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <Plus size={16} /> Novo produto
              </button>
            )}
            {creating && <div style={{ marginBottom: 16 }}><ProductForm onSave={handleCreate} onCancel={() => setCreating(false)} /></div>}
            {editing && <div style={{ marginBottom: 16 }}><ProductForm initial={editing} onSave={handleUpdate} onCancel={() => setEditing(null)} /></div>}

            {loading ? (
              <p style={{ textAlign: 'center', color: '#8a8378', fontSize: 13 }}>Carregando produtos...</p>
            ) : products.length === 0 && !creating ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#8a8378' }}>
                <Package size={32} color={COLORS.sand} style={{ marginBottom: 10 }} />
                <p style={{ fontSize: 14, margin: 0 }}>Nenhum produto cadastrado ainda.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {products.map((p) => (
                  <div key={p.id} style={{ background: '#fff', borderRadius: 14, padding: 12, display: 'flex', gap: 12, alignItems: 'center', boxShadow: '0 2px 10px rgba(47,61,46,0.06)', opacity: p.active ? 1 : 0.5 }}>
                    <div style={{ width: 52, height: 52, borderRadius: 10, background: COLORS.sand, flexShrink: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {p.image ? <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Package size={20} color={COLORS.green} />}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: COLORS.green, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</p>
                      <p style={{ margin: '2px 0 0', fontSize: 12, color: '#8a8378' }}>{p.category} · R$ {Number(p.price).toFixed(2).replace('.', ',')}</p>
                    </div>
                    <button onClick={() => toggleActive(p)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6 }}>
                      {p.active ? <Eye size={17} color={COLORS.sage} /> : <EyeOff size={17} color="#b2ab9f" />}
                    </button>
                    <button onClick={() => setEditing(p)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6 }}><Pencil size={17} color={COLORS.green} /></button>
                    <button onClick={() => handleDelete(p.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6 }}><Trash2 size={17} color="#c1594a" /></button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {tab === 'pedidos' && (
          <div>
            {orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#8a8378' }}>
                <ShoppingBag size={32} color={COLORS.sand} style={{ marginBottom: 10 }} />
                <p style={{ fontSize: 14, margin: 0 }}>Nenhum pedido registrado ainda.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {orders.map((o) => (
                  <div key={o.id} style={{ background: '#fff', borderRadius: 14, padding: 14, boxShadow: '0 2px 10px rgba(47,61,46,0.06)' }}>
                    <p style={{ margin: '0 0 6px', fontSize: 12, color: '#8a8378' }}>{o.date ? new Date(o.date).toLocaleString('pt-BR') : ''}</p>
                    {o.items?.map((it, i) => (
                      <p key={i} style={{ margin: '2px 0', fontSize: 13, color: COLORS.green }}>{it.qty}x {it.name} — R$ {(it.qty * it.price).toFixed(2).replace('.', ',')}</p>
                    ))}
                    <p style={{ margin: '8px 0 0', fontWeight: 700, fontSize: 14, color: COLORS.green, borderTop: `1px solid ${COLORS.cream}`, paddingTop: 8 }}>
                      Total: R$ {o.total?.toFixed(2).replace('.', ',')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(undefined);

  useEffect(() => onAuthStateChanged(auth, setUser), []);

  if (user === undefined) return <div style={{ minHeight: '100vh', background: COLORS.cream }} />;
  return user ? <Dashboard /> : <Login />;
}
