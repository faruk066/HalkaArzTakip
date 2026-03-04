import React, { useState, useEffect, useMemo } from 'react';
import {
  Wallet,
  TrendingUp,
  Users,
  Plus,
  Trash2,
  Percent,
  Save,
  ChevronDown,
  ChevronUp,
  Edit2,
  LogOut,
  Lock,
  Activity
} from 'lucide-react';

// --- Başlangıç Verileri (PDF'den Alınmıştır) ---
const INITIAL_TICKERS = {
  'EMPAE': { currentPrice: 22.00 },
  'GENKM': { currentPrice: 11.00 },
  'MCARD': { currentPrice: 80.00 },
  'LXGYO': { currentPrice: 12.05 },
  'SVGYO': { currentPrice: 3.64 }
};

const INITIAL_ACCOUNTS = [
  {
    id: '1',
    owner: 'MURAT',
    bank: 'YAPIKREDİ',
    holdings: [
      { id: '1-1', ticker: 'EMPAE', qty: 20, buyPrice: 22.00 },
      { id: '1-2', ticker: 'GENKM', qty: 177, buyPrice: 11.00 }
    ]
  },
  {
    id: '2',
    owner: 'FARUK',
    bank: 'DENİZBANK',
    holdings: [
      { id: '2-1', ticker: 'EMPAE', qty: 20, buyPrice: 22.00 },
      { id: '2-2', ticker: 'GENKM', qty: 150, buyPrice: 11.00 },
      { id: '2-3', ticker: 'MCARD', qty: 10, buyPrice: 80.00 },
      { id: '2-4', ticker: 'LXGYO', qty: 70, buyPrice: 12.05 },
      { id: '2-5', ticker: 'SVGYO', qty: 200, buyPrice: 3.64 }
    ]
  },
  {
    id: '3',
    owner: 'ADEM',
    bank: 'DENİZBANK',
    holdings: [
      { id: '3-1', ticker: 'GENKM', qty: 150, buyPrice: 11.00 },
      { id: '3-2', ticker: 'MCARD', qty: 10, buyPrice: 80.00 },
      { id: '3-3', ticker: 'LXGYO', qty: 70, buyPrice: 12.05 },
      { id: '3-4', ticker: 'SVGYO', qty: 200, buyPrice: 3.64 }
    ]
  },
  {
    id: '4',
    owner: 'HALAM',
    bank: 'GARANTİ',
    holdings: [
      { id: '4-1', ticker: 'GENKM', qty: 178, buyPrice: 11.00 }
    ]
  },
  {
    id: '5',
    owner: 'ANAM',
    bank: 'BURGAN',
    holdings: [
      { id: '5-1', ticker: 'EMPAE', qty: 20, buyPrice: 22.00 },
      { id: '5-2', ticker: 'SVGYO', qty: 174, buyPrice: 3.64 },
      { id: '5-3', ticker: 'MCARD', qty: 10, buyPrice: 80.00 },
      { id: '5-4', ticker: 'LXGYO', qty: 79, buyPrice: 12.05 }
    ]
  },
  {
    id: '6',
    owner: 'ANANEM',
    bank: 'GARANTİ',
    holdings: [
      { id: '6-1', ticker: 'GENKM', qty: 178, buyPrice: 11.00 },
      { id: '6-2', ticker: 'EMPAE', qty: 20, buyPrice: 22.00 }
    ]
  }
];

// --- Yardımcı Fonksiyonlar ---
const formatCurrency = (val) => {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(val);
};

const formatPct = (val) => {
  return `%${val.toFixed(2)}`;
};

// --- Ana Uygulama Bileşeni ---
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('ipo_auth') === 'true';
  });
  const [activeTab, setActiveTab] = useState('dashboard');

  // State tanımlamaları ve LocalStorage senkronizasyonu
  const [tickers, setTickers] = useState(() => {
    const saved = localStorage.getItem('ipo_tickers');
    return saved ? JSON.parse(saved) : INITIAL_TICKERS;
  });

  const [accounts, setAccounts] = useState(() => {
    const saved = localStorage.getItem('ipo_accounts');
    return saved ? JSON.parse(saved) : INITIAL_ACCOUNTS;
  });

  useEffect(() => {
    localStorage.setItem('ipo_tickers', JSON.stringify(tickers));
  }, [tickers]);

  useEffect(() => {
    localStorage.setItem('ipo_accounts', JSON.stringify(accounts));
  }, [accounts]);

  // Hesaplamalar
  const calculateAccountStats = (account) => {
    let totalCost = 0;
    let currentValue = 0;

    account.holdings.forEach(h => {
      totalCost += h.qty * h.buyPrice;
      const currentPrice = tickers[h.ticker]?.currentPrice || h.buyPrice;
      currentValue += h.qty * currentPrice;
    });

    const profit = currentValue - totalCost;
    const profitPct = totalCost > 0 ? (profit / totalCost) * 100 : 0;

    return { totalCost, currentValue, profit, profitPct };
  };

  const overallStats = useMemo(() => {
    let totalCost = 0;
    let currentValue = 0;

    accounts.forEach(acc => {
      const stats = calculateAccountStats(acc);
      totalCost += stats.totalCost;
      currentValue += stats.currentValue;
    });

    const profit = currentValue - totalCost;
    const profitPct = totalCost > 0 ? (profit / totalCost) * 100 : 0;

    return { totalCost, currentValue, profit, profitPct };
  }, [accounts, tickers, calculateAccountStats]);

  // --- Login Görünümü ---
  const LoginView = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e) => {
      e.preventDefault();
      if (username === 'faruk' && password === '2140072') {
        localStorage.setItem('ipo_auth', 'true');
        setIsAuthenticated(true);
        setError('');
      } else {
        setError('Kullanıcı adı veya şifre hatalı!');
      }
    };

    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl translate-x-10 -translate-y-10"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl -translate-x-10 translate-y-10"></div>

          <div className="flex justify-center mb-8 relative">
            <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 shadow-inner">
              <Lock size={32} className="text-indigo-400" />
            </div>
          </div>

          <h2 className="text-2xl font-black text-center text-white mb-2 tracking-tight">Giriş Yap</h2>
          <p className="text-center text-slate-400 mb-8 text-sm">Arz Takipçisi'ne devam etmek için giriş yapın.</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 ml-1">Kullanıcı Adı</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-800 border-2 border-slate-700 rounded-xl p-3.5 text-white outline-none focus:border-indigo-500 transition-colors"
                placeholder="Kullanıcı adınız"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 ml-1">Şifre</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-800 border-2 border-slate-700 rounded-xl p-3.5 text-white outline-none focus:border-indigo-500 transition-colors"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm p-3 rounded-lg text-center animate-in fade-in zoom-in duration-200">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/25 transition-all active:scale-[0.98] mt-4"
            >
              Giriş Yap
            </button>
          </form>
        </div>
      </div>
    );
  };

  // --- Görünümler ---
  const DashboardView = () => (
    <div className="space-y-6 pb-24 animate-in fade-in duration-300">
      <div className="bg-gradient-to-br from-indigo-900 to-slate-900 p-6 rounded-3xl shadow-xl border border-indigo-500/20">
        <h2 className="text-indigo-200 text-sm font-medium mb-1">Toplam Portföy Değeri</h2>
        <div className="text-4xl font-bold text-white tracking-tight mb-4">
          {formatCurrency(overallStats.currentValue)}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 p-3 rounded-2xl">
            <p className="text-xs text-indigo-200 mb-1">Toplam Maliyet</p>
            <p className="text-lg font-semibold text-white">{formatCurrency(overallStats.totalCost)}</p>
          </div>
          <div className={`p-3 rounded-2xl ${overallStats.profit >= 0 ? 'bg-emerald-500/10' : 'bg-rose-500/10'}`}>
            <p className={`text-xs mb-1 ${overallStats.profit >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
              Toplam Kar / Zarar
            </p>
            <p className={`text-lg font-bold flex items-center gap-1 ${overallStats.profit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {overallStats.profit >= 0 ? <TrendingUp size={16} /> : <TrendingUp size={16} className="rotate-180" />}
              {formatCurrency(overallStats.profit)}
            </p>
            <p className={`text-xs font-medium ${overallStats.profit >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
              {overallStats.profit >= 0 ? '+' : ''}{formatPct(overallStats.profitPct)}
            </p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-slate-100 mb-4 px-1 flex items-center gap-2">
          <Activity size={20} className="text-indigo-400" />
          Hesap Özetleri
        </h3>
        <div className="space-y-3">
          {accounts.map(acc => {
            const stats = calculateAccountStats(acc);
            const isProfit = stats.profit >= 0;
            return (
              <div key={acc.id} className="bg-slate-800 p-4 rounded-2xl flex items-center justify-between shadow-sm border border-slate-700">
                <div>
                  <h4 className="font-bold text-slate-200">{acc.owner}</h4>
                  <p className="text-xs text-slate-400">{acc.bank}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-100">{formatCurrency(stats.currentValue)}</p>
                  <p className={`text-sm font-medium ${isProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {isProfit ? '+' : ''}{formatCurrency(stats.profit)} ({isProfit ? '+' : ''}{formatPct(stats.profitPct)})
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const AccountsView = () => {
    const [expandedAcc, setExpandedAcc] = useState(null);
    const [isAddingAcc, setIsAddingAcc] = useState(false);
    const [newAccData, setNewAccData] = useState({ owner: '', bank: '' });

    // Hisse Ekleme State'leri
    const [addingHoldingTo, setAddingHoldingTo] = useState(null);
    const [newHoldingData, setNewHoldingData] = useState({ ticker: '', qty: '', buyPrice: '' });

    // Hisse Düzenleme State'leri
    const [editingHoldingId, setEditingHoldingId] = useState(null);
    const [editHoldingData, setEditHoldingData] = useState({ qty: '', buyPrice: '' });

    const handleAddAccount = () => {
      if (!newAccData.owner) return;
      const newAcc = {
        id: Date.now().toString(),
        owner: newAccData.owner.toUpperCase(),
        bank: newAccData.bank.toUpperCase(),
        holdings: []
      };
      setAccounts([...accounts, newAcc]);
      setNewAccData({ owner: '', bank: '' });
      setIsAddingAcc(false);
    };

    const handleDeleteAccount = (id) => {
      if (window.confirm('Bu hesabı silmek istediğinize emin misiniz?')) {
        setAccounts(accounts.filter(a => a.id !== id));
      }
    };

    const handleAddHolding = (accId) => {
      if (!newHoldingData.ticker || !newHoldingData.qty || !newHoldingData.buyPrice) return;

      const tickerName = newHoldingData.ticker.toUpperCase();

      // Ticker yoksa listeye ekle
      if (!tickers[tickerName]) {
        setTickers(prev => ({
          ...prev,
          [tickerName]: { currentPrice: parseFloat(newHoldingData.buyPrice) }
        }));
      }

      const newHolding = {
        id: Date.now().toString(),
        ticker: tickerName,
        qty: parseInt(newHoldingData.qty),
        buyPrice: parseFloat(newHoldingData.buyPrice.toString().replace(',', '.'))
      };

      setAccounts(accounts.map(acc => {
        if (acc.id === accId) {
          return { ...acc, holdings: [...acc.holdings, newHolding] };
        }
        return acc;
      }));

      setAddingHoldingTo(null);
      setNewHoldingData({ ticker: '', qty: '', buyPrice: '' });
    };

    const handleDeleteHolding = (accId, holdingId) => {
      if (window.confirm('Bu hisseyi silmek istediğinize emin misiniz?')) {
        setAccounts(accounts.map(acc => {
          if (acc.id === accId) {
            return { ...acc, holdings: acc.holdings.filter(h => h.id !== holdingId) };
          }
          return acc;
        }));
      }
    };

    const handleStartEdit = (holding) => {
      setEditingHoldingId(holding.id);
      setEditHoldingData({
        qty: holding.qty.toString(),
        buyPrice: holding.buyPrice.toString()
      });
    };

    const handleSaveEdit = (accId, holdingId) => {
      if (!editHoldingData.qty || !editHoldingData.buyPrice) return;

      const updatedQty = parseInt(editHoldingData.qty);
      const updatedBuyPrice = parseFloat(editHoldingData.buyPrice.toString().replace(',', '.'));

      setAccounts(accounts.map(acc => {
        if (acc.id === accId) {
          return {
            ...acc,
            holdings: acc.holdings.map(h => {
              if (h.id === holdingId) {
                return { ...h, qty: updatedQty, buyPrice: updatedBuyPrice };
              }
              return h;
            })
          };
        }
        return acc;
      }));

      setEditingHoldingId(null);
      setEditHoldingData({ qty: '', buyPrice: '' });
    };

    return (
      <div className="space-y-4 pb-24 animate-in fade-in duration-300">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Hesap Yönetimi</h2>
          <button
            onClick={() => setIsAddingAcc(!isAddingAcc)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full transition-colors"
          >
            <Plus size={20} />
          </button>
        </div>

        {isAddingAcc && (
          <div className="bg-slate-800 p-4 rounded-2xl mb-4 border border-indigo-500/50">
            <h3 className="text-sm font-bold text-indigo-300 mb-3">Yeni Hesap Ekle</h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Hesap Sahibi (örn: KEMAL)"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500"
                value={newAccData.owner}
                onChange={e => setNewAccData({ ...newAccData, owner: e.target.value })}
              />
              <input
                type="text"
                placeholder="Banka / Aracı Kurum"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500"
                value={newAccData.bank}
                onChange={e => setNewAccData({ ...newAccData, bank: e.target.value })}
              />
              <button
                onClick={handleAddAccount}
                className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700"
              >
                Hesabı Kaydet
              </button>
            </div>
          </div>
        )}

        {accounts.map(acc => {
          const stats = calculateAccountStats(acc);
          const isExpanded = expandedAcc === acc.id;

          return (
            <div key={acc.id} className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 mb-4">
              <div
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-750"
                onClick={() => setExpandedAcc(isExpanded ? null : acc.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center font-bold">
                    {acc.owner.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg leading-tight">{acc.owner}</h3>
                    <p className="text-xs text-slate-400">{acc.bank}</p>
                  </div>
                </div>
                <div className="text-right flex items-center gap-3">
                  <div>
                    <p className="font-bold text-white">{formatCurrency(stats.currentValue)}</p>
                    <p className={`text-xs font-medium ${stats.profit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {stats.profit >= 0 ? '+' : ''}{formatCurrency(stats.profit)}
                    </p>
                  </div>
                  {isExpanded ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
                </div>
              </div>

              {isExpanded && (
                <div className="p-4 pt-0 border-t border-slate-700 bg-slate-800/50">
                  <div className="space-y-2 mt-4">
                    {acc.holdings.map(h => {
                      const currentPrice = tickers[h.ticker]?.currentPrice || h.buyPrice;
                      const val = h.qty * currentPrice;
                      const cost = h.qty * h.buyPrice;
                      const p = val - cost;
                      const isP = p >= 0;
                      const isEditing = editingHoldingId === h.id;

                      if (isEditing) {
                        return (
                          <div key={h.id} className="bg-slate-900 p-3 rounded-xl border border-indigo-500/50">
                            <h4 className="font-bold text-indigo-300 mb-2">{h.ticker} <span className="text-xs font-normal text-slate-400">Düzenle</span></h4>
                            <div className="grid grid-cols-2 gap-2 mb-3">
                              <div>
                                <label className="text-xs text-slate-400 mb-1 block">Lot (Adet)</label>
                                <input
                                  type="number"
                                  className="w-full bg-slate-800 text-white p-2 rounded-lg text-sm outline-none border border-slate-700 focus:border-indigo-500"
                                  value={editHoldingData.qty}
                                  onChange={e => setEditHoldingData({ ...editHoldingData, qty: e.target.value })}
                                />
                              </div>
                              <div>
                                <label className="text-xs text-slate-400 mb-1 block">Maliyet</label>
                                <input
                                  type="number"
                                  step="0.01"
                                  className="w-full bg-slate-800 text-white p-2 rounded-lg text-sm outline-none border border-slate-700 focus:border-indigo-500"
                                  value={editHoldingData.buyPrice}
                                  onChange={e => setEditHoldingData({ ...editHoldingData, buyPrice: e.target.value })}
                                />
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => handleSaveEdit(acc.id, h.id)} className="flex-1 bg-emerald-600 text-white text-sm py-2 rounded-lg font-bold hover:bg-emerald-500 flex items-center justify-center gap-1">
                                <Save size={16} /> Kaydet
                              </button>
                              <button onClick={() => setEditingHoldingId(null)} className="flex-1 bg-slate-700 text-white text-sm py-2 rounded-lg hover:bg-slate-600">
                                İptal
                              </button>
                            </div>
                          </div>
                        )
                      }

                      return (
                        <div key={h.id} className="bg-slate-900 p-3 rounded-xl flex items-center justify-between group border border-transparent hover:border-slate-700 transition-colors">
                          <div>
                            <span className="font-bold text-indigo-300">{h.ticker}</span>
                            <p className="text-xs text-slate-400">{h.qty} Lot x {formatCurrency(h.buyPrice)} (Mal: {formatCurrency(cost)})</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <p className="font-bold text-white">{formatCurrency(val)}</p>
                              <p className={`text-xs ${isP ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {isP ? '+' : ''}{formatCurrency(p)}
                              </p>
                            </div>
                            <div className="flex flex-col gap-1 border-l border-slate-700 pl-2">
                              <button onClick={() => handleStartEdit(h)} className="text-slate-500 hover:text-indigo-400 p-1" title="Düzenle">
                                <Edit2 size={16} />
                              </button>
                              <button onClick={() => handleDeleteHolding(acc.id, h.id)} className="text-slate-500 hover:text-rose-500 p-1" title="Sil">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {addingHoldingTo === acc.id ? (
                    <div className="mt-4 bg-slate-900 p-3 rounded-xl border border-dashed border-slate-600">
                      <h4 className="text-xs text-slate-400 mb-2">Yeni Hisse Ekle</h4>
                      <div className="grid grid-cols-3 gap-2 mb-3">
                        <input type="text" placeholder="Hisse" className="col-span-1 bg-slate-800 text-white p-2 rounded-lg text-sm outline-none border border-slate-700"
                          value={newHoldingData.ticker} onChange={e => setNewHoldingData({ ...newHoldingData, ticker: e.target.value.toUpperCase() })} />
                        <input type="number" placeholder="Adet" className="col-span-1 bg-slate-800 text-white p-2 rounded-lg text-sm outline-none border border-slate-700"
                          value={newHoldingData.qty} onChange={e => setNewHoldingData({ ...newHoldingData, qty: e.target.value })} />
                        <input type="number" step="0.01" placeholder="Maliyet" className="col-span-1 bg-slate-800 text-white p-2 rounded-lg text-sm outline-none border border-slate-700"
                          value={newHoldingData.buyPrice} onChange={e => setNewHoldingData({ ...newHoldingData, buyPrice: e.target.value })} />
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleAddHolding(acc.id)} className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white text-sm py-2 rounded-lg font-bold">Ekle</button>
                        <button onClick={() => setAddingHoldingTo(null)} className="flex-1 bg-slate-700 hover:bg-slate-600 text-white text-sm py-2 rounded-lg">İptal</button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => setAddingHoldingTo(acc.id)}
                        className="flex-1 flex items-center justify-center gap-2 bg-indigo-500/10 text-indigo-400 font-medium py-2 rounded-xl text-sm hover:bg-indigo-500/20"
                      >
                        <Plus size={16} /> Hisse Ekle
                      </button>
                      <button
                        onClick={() => handleDeleteAccount(acc.id)}
                        className="flex items-center justify-center px-4 bg-rose-500/10 text-rose-400 rounded-xl hover:bg-rose-500/20"
                        title="Hesabı Sil"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const PricesView = () => {
    const handlePriceChange = (ticker, newPrice) => {
      setTickers(prev => ({
        ...prev,
        [ticker]: { currentPrice: parseFloat(newPrice) }
      }));
    };

    const applyPercentageIncrease = (ticker, percentStr) => {
      const p = parseFloat(percentStr.replace(',', '.'));
      if (isNaN(p)) return;

      const currentPrice = tickers[ticker].currentPrice;
      const newPrice = currentPrice * (1 + (p / 100));
      // Borsa İstanbul fiyat adımlarına göre uyumlu olsun diye 2-3 hane
      handlePriceChange(ticker, newPrice.toFixed(3));
    };

    return (
      <div className="space-y-4 pb-24 animate-in fade-in duration-300">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white mb-1">Fiyat Güncellemeleri</h2>
          <p className="text-sm text-slate-400">Tüm portföylerdeki hisselerin değerleri buradaki fiyatlara göre hesaplanır.</p>
        </div>

        <div className="space-y-4">
          {Object.keys(tickers).map(ticker => {
            const data = tickers[ticker];
            return (
              <div key={ticker} className="bg-slate-800 p-4 rounded-2xl border border-slate-700">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-bold text-indigo-300 tracking-wide">{ticker}</h3>
                  <div className="font-mono text-lg text-white font-medium">
                    {formatCurrency(data.currentPrice)}
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-2 mt-2">
                  <div className="col-span-12 md:col-span-7 flex bg-slate-900 rounded-xl overflow-hidden border border-slate-700 focus-within:border-indigo-500">
                    <span className="flex items-center justify-center px-3 text-slate-400 bg-slate-800/50">
                      <Percent size={14} className="mr-1" /> Artış
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="örn: 10 veya 9.95"
                      className="w-full bg-transparent text-white p-2 text-sm outline-none"
                      id={`pct-${ticker}`}
                    />
                    <button
                      onClick={() => {
                        const val = document.getElementById(`pct-${ticker}`).value;
                        if (val) applyPercentageIncrease(ticker, val);
                        document.getElementById(`pct-${ticker}`).value = '';
                      }}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 font-bold text-sm transition-colors"
                    >
                      Uygula
                    </button>
                  </div>

                  <div className="col-span-12 md:col-span-5 flex gap-2">
                    <button
                      onClick={() => applyPercentageIncrease(ticker, '10')}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold py-2 shadow-lg shadow-indigo-900/20 transition-colors"
                    >
                      +10% Tavan
                    </button>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-700/50 flex gap-2 items-center">
                  <span className="text-xs text-slate-500 whitespace-nowrap">Manuel Fiyat:</span>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-white text-sm outline-none focus:border-indigo-500"
                    value={data.currentPrice}
                    onChange={e => handlePriceChange(ticker, e.target.value)}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const handleLogout = () => {
    localStorage.removeItem('ipo_auth');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <LoginView />;
  }

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 selection:bg-indigo-500/30">
      <header className="sticky top-0 z-10 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 p-4">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <h1 className="text-xl font-black bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent flex items-center gap-2">
            <TrendingUp size={24} className="text-indigo-400" />
            Arz Takipçisi
          </h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-800"
            title="Çıkış Yap"
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <main className="p-4 max-w-lg mx-auto">
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'accounts' && <AccountsView />}
        {activeTab === 'prices' && <PricesView />}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 pb-safe z-20">
        <div className="flex justify-around items-center max-w-lg mx-auto p-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center justify-center w-20 py-2 rounded-2xl transition-all ${activeTab === 'dashboard' ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Wallet size={24} className="mb-1" />
            <span className="text-[10px] font-bold">Özet</span>
          </button>

          <button
            onClick={() => setActiveTab('accounts')}
            className={`flex flex-col items-center justify-center w-20 py-2 rounded-2xl transition-all ${activeTab === 'accounts' ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Users size={24} className="mb-1" />
            <span className="text-[10px] font-bold">Hesaplar</span>
          </button>

          <button
            onClick={() => setActiveTab('prices')}
            className={`flex flex-col items-center justify-center w-20 py-2 rounded-2xl transition-all ${activeTab === 'prices' ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Activity size={24} className="mb-1" />
            <span className="text-[10px] font-bold">Fiyatlar</span>
          </button>
        </div>
      </nav>
    </div>
  );
}