import React, { createContext, useContext, useState, useEffect } from 'react';
import { createOfficialPdfBlob, blobToDataUrl } from '../services/pdfHelper';

const RequestContext = createContext(null);

const REQUESTS_STORAGE_KEY = 'pureframe_document_requests';
const WALLET_STORAGE_KEY = 'pureframe_wallet_balance';
const WALLET_HISTORY_STORAGE_KEY = 'pureframe_wallet_history';

// Sample pre-populated requests
const INITIAL_REQUESTS = [
  {
    id: 'REQ-PN-849102',
    userId: 'usr_pune_buyer',
    userName: 'Pune Property Buyer',
    userEmail: 'buyer@pune.gov.in',
    projectId: 'govind-vilas',
    projectName: 'GOVIND VILAS',
    buildingName: 'Wing A',
    floor: '4th Floor',
    flatNo: 'Flat 402',
    coordinates: { lat: 18.51121, lng: 73.85387 },
    reraId: 'P52100008590',
    taluka: 'Pune City',
    village: 'Pune (M Corp.)',
    district: 'Pune',
    docType: 'index_2',
    docTitle: 'Index 2 Registration Extract',
    fee: 499,
    paidVia: 'Wallet',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    status: 'pending',
    pdfFileData: null,
    pdfFileName: null,
    pdfFileSize: null,
    sharedLink: null,
    sharedAt: null,
    adminNotes: null
  },
  {
    id: 'REQ-PN-849088',
    userId: 'usr_pune_buyer',
    userName: 'Pune Property Buyer',
    userEmail: 'buyer@pune.gov.in',
    projectId: 'sampada-house',
    projectName: 'SAMPADA HOUSE',
    buildingName: 'Tower 2',
    floor: '7th Floor',
    flatNo: 'Flat 705',
    coordinates: { lat: 18.64385, lng: 73.79936 },
    reraId: 'P52100006412',
    taluka: 'Haveli',
    village: 'Pimpri Chinchawad (M Corp.)',
    district: 'Pune',
    docType: 'registered_deed',
    docTitle: 'Certified Registered Sale Deed',
    fee: 999,
    paidVia: 'Wallet',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    status: 'completed',
    pdfFileData: null, // Will be initialized if null
    pdfFileName: 'Sale_Deed_P52100006412_Certified.pdf',
    pdfFileSize: '1.45 MB',
    sharedLink: 'https://igrmaharashtra.gov.in/docs/sample_registered_deed_P52100006412.pdf',
    sharedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    adminNotes: 'Verified and retrieved directly from Haveli Sub-Registrar Office Registry No. 4.'
  }
];

const INITIAL_WALLET_HISTORY = [
  {
    id: 'TXN-W-101',
    type: 'credit',
    title: 'Initial Wallet Balance',
    amount: 5000,
    date: new Date(Date.now() - 86400000 * 2).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
  },
  {
    id: 'TXN-W-102',
    type: 'debit',
    title: 'Request: Registered Deed (SAMPADA HOUSE)',
    amount: 999,
    date: new Date(Date.now() - 86400000).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
  },
  {
    id: 'TXN-W-103',
    type: 'debit',
    title: 'Request: Index 2 (GOVIND VILAS)',
    amount: 499,
    date: new Date(Date.now() - 3600000 * 4).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
  }
];

export function RequestProvider({ children }) {
  const [requests, setRequests] = useState(() => {
    try {
      const saved = localStorage.getItem(REQUESTS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return INITIAL_REQUESTS;
    } catch {
      return INITIAL_REQUESTS;
    }
  });

  const [walletBalance, setWalletBalance] = useState(() => {
    try {
      const saved = localStorage.getItem(WALLET_STORAGE_KEY);
      return saved !== null ? parseInt(saved, 10) : 5000;
    } catch {
      return 5000;
    }
  });

  const [walletHistory, setWalletHistory] = useState(() => {
    try {
      const saved = localStorage.getItem(WALLET_HISTORY_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
      return INITIAL_WALLET_HISTORY;
    } catch {
      return INITIAL_WALLET_HISTORY;
    }
  });

  // Ensure initial completed request has a valid downloadable PDF Data URL if missing
  useEffect(() => {
    const needDefaultPdf = requests.find(r => r.id === 'REQ-PN-849088' && !r.pdfFileData);
    if (needDefaultPdf) {
      const blob = createOfficialPdfBlob({
        docType: needDefaultPdf.docType,
        docTitle: needDefaultPdf.docTitle,
        projectName: needDefaultPdf.projectName,
        buildingName: needDefaultPdf.buildingName,
        floor: needDefaultPdf.floor,
        flatNo: needDefaultPdf.flatNo,
        village: needDefaultPdf.village,
        taluka: needDefaultPdf.taluka,
        district: needDefaultPdf.district,
        reraId: needDefaultPdf.reraId,
        coordinates: needDefaultPdf.coordinates,
        requestId: needDefaultPdf.id,
        officerName: 'Joint Sub-Registrar Class-II, Haveli No. 4'
      });
      blobToDataUrl(blob).then(dataUrl => {
        setRequests(prev => prev.map(r => r.id === 'REQ-PN-849088' ? { ...r, pdfFileData: dataUrl } : r));
      }).catch(err => console.warn('Could not gen default sample PDF:', err));
    }
  }, []);

  // Save requests to localStorage whenever updated
  useEffect(() => {
    try {
      localStorage.setItem(REQUESTS_STORAGE_KEY, JSON.stringify(requests));
    } catch (e) {
      console.warn('Failed to save requests:', e);
    }
  }, [requests]);

  // Save wallet balance to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(WALLET_STORAGE_KEY, String(walletBalance));
    } catch (e) {
      console.warn('Failed to save wallet balance:', e);
    }
  }, [walletBalance]);

  // Save wallet history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(WALLET_HISTORY_STORAGE_KEY, JSON.stringify(walletHistory));
    } catch (e) {
      console.warn('Failed to save wallet history:', e);
    }
  }, [walletHistory]);

  /**
   * Create a new document request paid via Wallet
   */
  const createDocumentRequest = ({
    user,
    project = {},
    docType, // 'registered_deed' | 'index_2'
    buildingName = '',
    floor = '',
    flatNo = '',
    projectName = '',
    coordinates = null,
    taluka = '',
    village = '',
    district = 'Pune',
    reraId = '',
    fee = docType === 'registered_deed' ? 999 : 499
  }) => {
    if (walletBalance < fee) {
      return {
        success: false,
        message: `Insufficient wallet balance. You have ₹${walletBalance.toLocaleString('en-IN')}, but ₹${fee.toLocaleString('en-IN')} is required.`
      };
    }

    // Deduct from wallet
    const newBalance = walletBalance - fee;
    setWalletBalance(newBalance);

    const docTitle = docType === 'registered_deed' 
      ? 'Certified Registered Sale Deed' 
      : 'Index 2 Registration Extract';

    const newReqId = `REQ-PN-${Math.floor(100000 + Math.random() * 900000)}`;

    const effectiveProjectName = projectName || project.name || 'Custom Pune Property Project';
    const effectiveTaluka = taluka || project.taluka || 'Pune City';
    const effectiveVillage = village || project.village || project.locality || 'Pune';
    const effectiveRera = reraId || project.rera || project.reraNumbers || 'P52100008590';
    const effectiveCoords = coordinates || (project.coordinates ? project.coordinates : { lat: 18.52043, lng: 73.85674 });

    const newRequest = {
      id: newReqId,
      userId: user?.id || 'usr_pune_buyer',
      userName: user?.name || 'Pune Property Buyer',
      userEmail: user?.email || 'buyer@pune.gov.in',
      projectId: project.id || project.projectId || 'pune-property',
      projectName: effectiveProjectName,
      buildingName: buildingName ? buildingName.trim() : '',
      floor: floor ? floor.trim() : '',
      flatNo: flatNo ? flatNo.trim() : '',
      coordinates: effectiveCoords,
      reraId: effectiveRera,
      taluka: effectiveTaluka,
      village: effectiveVillage,
      district: district || 'Pune',
      docType: docType,
      docTitle: docTitle,
      fee: fee,
      paidVia: 'Wallet',
      createdAt: new Date().toISOString(),
      status: 'pending',
      pdfFileData: null,
      pdfFileName: null,
      pdfFileSize: null,
      sharedLink: null,
      sharedAt: null,
      adminNotes: null
    };

    setRequests(prev => [newRequest, ...prev]);

    // Record wallet transaction
    const newTxn = {
      id: `TXN-W-${Date.now().toString().slice(-4)}`,
      type: 'debit',
      title: `Request: ${docTitle} (${effectiveProjectName})`,
      amount: fee,
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    };
    setWalletHistory(prev => [newTxn, ...prev]);

    return {
      success: true,
      request: newRequest,
      newBalance: newBalance
    };
  };

  /**
   * Admin fulfills request with an actual PDF file upload
   */
  const fulfillRequestWithPdf = (requestId, { pdfFileData, pdfFileName, pdfFileSize, adminNotes = '' }) => {
    if (!requestId || !pdfFileData) {
      return { success: false, message: 'Request ID and actual PDF file data are required.' };
    }

    setRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        return {
          ...req,
          status: 'completed',
          pdfFileData: pdfFileData,
          pdfFileName: pdfFileName || `${req.docType}_${req.id}.pdf`,
          pdfFileSize: pdfFileSize || '1.2 MB',
          sharedLink: pdfFileData, // Dual compatibility
          sharedAt: new Date().toISOString(),
          completedAt: new Date().toISOString(),
          adminNotes: adminNotes.trim() || 'Verified, certified, and officially uploaded by Pune District IGR Admin.'
        };
      }
      return req;
    }));

    return { success: true };
  };

  /**
   * Admin adds funds directly to the single citizen user's wallet
   */
  const adminAddUserWalletFunds = (amount, reason = 'Admin Credit Top-up', targetUserId = 'usr_pune_buyer') => {
    const num = parseInt(amount, 10);
    if (isNaN(num) || num <= 0) {
      return { success: false, message: 'Please enter a valid amount greater than 0.' };
    }

    const newBalance = walletBalance + num;
    setWalletBalance(newBalance);

    const newTxn = {
      id: `TXN-W-${Date.now().toString().slice(-4)}`,
      type: 'credit',
      title: `Admin Credit: ${reason || 'Funds Added by Admin'}`,
      amount: num,
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    };
    setWalletHistory(prev => [newTxn, ...prev]);

    return {
      success: true,
      newBalance: newBalance,
      addedAmount: num
    };
  };

  /**
   * Legacy link sharing (also marks as completed)
   */
  const shareDocumentLink = (requestId, linkUrl, adminNotes = '') => {
    if (!requestId || !linkUrl) return { success: false, message: 'Request ID and link URL are required.' };

    setRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        return {
          ...req,
          status: 'completed',
          sharedLink: linkUrl.trim(),
          sharedAt: new Date().toISOString(),
          adminNotes: adminNotes.trim() || 'Verified and uploaded by Admin via MahaRERA Archive.'
        };
      }
      return req;
    }));

    return { success: true };
  };

  /**
   * Add money to wallet (user self-recharge)
   */
  const addWalletFunds = (amount) => {
    const num = parseInt(amount, 10);
    if (isNaN(num) || num <= 0) return;
    const newBalance = walletBalance + num;
    setWalletBalance(newBalance);

    const newTxn = {
      id: `TXN-W-${Date.now().toString().slice(-4)}`,
      type: 'credit',
      title: 'Wallet Recharge',
      amount: num,
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    };
    setWalletHistory(prev => [newTxn, ...prev]);
    return newBalance;
  };

  /**
   * Get user specific requests
   */
  const getUserRequests = (userId) => {
    if (!userId) return requests;
    return requests.filter(r => r.userId === userId || r.userEmail === userId);
  };

  /**
   * Check if project already has a request
   */
  const getProjectRequests = (projectId, reraId) => {
    return requests.filter(r => 
      (projectId && r.projectId === projectId) || 
      (reraId && r.reraId === reraId)
    );
  };

  return (
    <RequestContext.Provider
      value={{
        requests,
        walletBalance,
        walletHistory,
        createDocumentRequest,
        fulfillRequestWithPdf,
        adminAddUserWalletFunds,
        shareDocumentLink,
        addWalletFunds,
        getUserRequests,
        getProjectRequests
      }}
    >
      {children}
    </RequestContext.Provider>
  );
}

export function useRequests() {
  const context = useContext(RequestContext);
  if (!context) {
    throw new Error('useRequests must be used within a RequestProvider');
  }
  return context;
}
