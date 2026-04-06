(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "addStockEntry",
    ()=>addStockEntry,
    "addSupplierPayment",
    ()=>addSupplierPayment,
    "addTransaction",
    ()=>addTransaction,
    "createBill",
    ()=>createBill,
    "createCustomer",
    ()=>createCustomer,
    "createItem",
    ()=>createItem,
    "deleteItem",
    ()=>deleteItem,
    "deleteTransaction",
    ()=>deleteTransaction,
    "getCategories",
    ()=>getCategories,
    "getCustomer",
    ()=>getCustomer,
    "getCustomers",
    ()=>getCustomers,
    "getItem",
    ()=>getItem,
    "getItems",
    ()=>getItems,
    "getProfitSummary",
    ()=>getProfitSummary,
    "getRecentBills",
    ()=>getRecentBills,
    "getStockEntries",
    ()=>getStockEntries,
    "getSupplierPayments",
    ()=>getSupplierPayments,
    "getSupplierSummary",
    ()=>getSupplierSummary,
    "getTodaySummary",
    ()=>getTodaySummary,
    "getTodaysCredits",
    ()=>getTodaysCredits,
    "getTransactions",
    ()=>getTransactions,
    "quickSell",
    ()=>quickSell,
    "updateItem",
    ()=>updateItem
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
;
const api = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].create({
    baseURL: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_API_URL || "http://10.178.240.203:8000"
});
const getCustomers = ()=>api.get("/customers/").then((r)=>r.data);
const getCustomer = (id)=>api.get(`/customers/${id}`).then((r)=>r.data);
const createCustomer = (name, phone)=>api.post("/customers/", {
        name,
        phone
    }).then((r)=>r.data);
const getTransactions = (customerId)=>api.get(`/transactions/customer/${customerId}`).then((r)=>r.data);
const addTransaction = (customer_id, type, amount, note)=>api.post("/transactions/", {
        customer_id,
        type,
        amount,
        note
    }).then((r)=>r.data);
const deleteTransaction = (id)=>api.delete(`/transactions/${id}`);
const getTodaysCredits = ()=>api.get("/transactions/today").then((r)=>r.data);
const getItems = ()=>api.get("/items/").then((r)=>r.data);
const getItem = (id)=>api.get(`/items/${id}`).then((r)=>r.data);
const createItem = (data)=>api.post("/items/", data).then((r)=>r.data);
const updateItem = (id, data)=>api.put(`/items/${id}`, data).then((r)=>r.data);
const deleteItem = (id)=>api.delete(`/items/${id}`);
const getCategories = ()=>api.get("/items/categories").then((r)=>r.data);
const addStockEntry = (data)=>api.post("/stock/entry", data).then((r)=>r.data);
const getStockEntries = (itemId)=>api.get(`/stock/entries/${itemId}`).then((r)=>r.data);
const quickSell = (item_id, quantity)=>api.post("/sales/quick", {
        item_id,
        quantity
    }).then((r)=>r.data);
const createBill = (items)=>api.post("/sales/bill", {
        items
    }).then((r)=>r.data);
const getProfitSummary = ()=>api.get("/sales/profit").then((r)=>r.data);
const getRecentBills = ()=>api.get("/sales/bills").then((r)=>r.data);
const getTodaySummary = ()=>api.get("/sales/summary/today").then((r)=>r.data);
const addSupplierPayment = (data)=>api.post("/suppliers/payment", data).then((r)=>r.data);
const getSupplierPayments = ()=>api.get("/suppliers/payments").then((r)=>r.data);
const getSupplierSummary = ()=>api.get("/suppliers/summary").then((r)=>r.data);
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Landing
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function Landing() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [totalPending, setTotalPending] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [pendingCount, setPendingCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [itemCount, setItemCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [lowCount, setLowCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [todayProfit, setTodayProfit] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [todayRevenue, setTodayRevenue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [lowItems, setLowItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [restockModal, setRestockModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [restockQty, setRestockQty] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [restocking, setRestocking] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Landing.useEffect": ()=>{
            Promise.all([
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCustomers"])(),
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getItems"])(),
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getProfitSummary"])()
            ]).then({
                "Landing.useEffect": ([customers, items, profit])=>{
                    setTotalPending(customers.reduce({
                        "Landing.useEffect": (s, c)=>s + (c.balance > 0 ? c.balance : 0)
                    }["Landing.useEffect"], 0));
                    setPendingCount(customers.filter({
                        "Landing.useEffect": (c)=>c.balance > 0
                    }["Landing.useEffect"]).length);
                    setItemCount(items.length);
                    setLowCount(items.filter({
                        "Landing.useEffect": (i)=>i.is_low
                    }["Landing.useEffect"]).length);
                    setTodayProfit(profit.today_profit);
                    setTodayRevenue(profit.today_revenue);
                    setLowCount(items.filter({
                        "Landing.useEffect": (i)=>i.is_low
                    }["Landing.useEffect"]).length);
                    setLowItems(items.filter({
                        "Landing.useEffect": (i)=>i.is_low
                    }["Landing.useEffect"]));
                }
            }["Landing.useEffect"]).finally({
                "Landing.useEffect": ()=>setLoading(false)
            }["Landing.useEffect"]);
        }
    }["Landing.useEffect"], []);
    const Card = ({ onClick, gradient, emoji, tag, title, children, linkColor })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            onClick: onClick,
            style: {
                background: "white",
                borderRadius: 24,
                border: "1.5px solid #EEEEE8",
                boxShadow: "0 2px 16px rgba(0,0,0,0.05)",
                overflow: "hidden",
                cursor: "pointer"
            },
            onTouchStart: (e)=>e.currentTarget.style.transform = "scale(0.98)",
            onTouchEnd: (e)=>e.currentTarget.style.transform = "scale(1)",
            onMouseDown: (e)=>e.currentTarget.style.transform = "scale(0.98)",
            onMouseUp: (e)=>e.currentTarget.style.transform = "scale(1)",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        background: gradient,
                        padding: "20px 20px 18px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between"
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    style: {
                                        fontSize: 11,
                                        fontWeight: 700,
                                        letterSpacing: "0.15em",
                                        textTransform: "uppercase",
                                        margin: "0 0 4px",
                                        color: "rgba(255,255,255,0.7)"
                                    },
                                    children: tag
                                }, void 0, false, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 49,
                                    columnNumber: 11
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    style: {
                                        fontFamily: "var(--font-playfair), serif",
                                        color: "white",
                                        fontSize: 26,
                                        fontWeight: 900,
                                        margin: 0,
                                        lineHeight: 1
                                    },
                                    children: title
                                }, void 0, false, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 50,
                                    columnNumber: 11
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 48,
                            columnNumber: 9
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                fontSize: 36
                            },
                            children: emoji
                        }, void 0, false, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 52,
                            columnNumber: 9
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/page.tsx",
                    lineNumber: 47,
                    columnNumber: 7
                }, this),
                children,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        padding: "0 20px 16px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        gap: 4
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            style: {
                                fontSize: 12,
                                fontWeight: 700,
                                color: linkColor
                            },
                            children: "Open"
                        }, void 0, false, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 56,
                            columnNumber: 9
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                            size: 14,
                            color: linkColor
                        }, void 0, false, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 57,
                            columnNumber: 9
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/page.tsx",
                    lineNumber: 55,
                    columnNumber: 7
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/page.tsx",
            lineNumber: 39,
            columnNumber: 5
        }, this);
    const StatRow = ({ left, right })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                padding: "16px 20px",
                display: "flex"
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        flex: 1,
                        borderRight: "1px solid #F3F4F6",
                        paddingRight: 16
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            style: {
                                fontSize: 11,
                                fontWeight: 700,
                                color: "#9CA3AF",
                                textTransform: "uppercase",
                                letterSpacing: "0.1em",
                                margin: "0 0 4px"
                            },
                            children: left.label
                        }, void 0, false, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 66,
                            columnNumber: 9
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            style: {
                                fontSize: 20,
                                fontWeight: 900,
                                color: left.color,
                                margin: 0
                            },
                            children: loading ? "—" : left.value
                        }, void 0, false, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 67,
                            columnNumber: 9
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/page.tsx",
                    lineNumber: 65,
                    columnNumber: 7
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        flex: 1,
                        paddingLeft: 16
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            style: {
                                fontSize: 11,
                                fontWeight: 700,
                                color: "#9CA3AF",
                                textTransform: "uppercase",
                                letterSpacing: "0.1em",
                                margin: "0 0 4px"
                            },
                            children: right.label
                        }, void 0, false, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 70,
                            columnNumber: 9
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            style: {
                                fontSize: 20,
                                fontWeight: 900,
                                color: right.color,
                                margin: 0
                            },
                            children: loading ? "—" : right.value
                        }, void 0, false, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 71,
                            columnNumber: 9
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/page.tsx",
                    lineNumber: 69,
                    columnNumber: 7
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/page.tsx",
            lineNumber: 64,
            columnNumber: 5
        }, this);
    const handleRestock = async ()=>{
        if (!restockModal || !restockQty || Number(restockQty) <= 0) return;
        setRestocking(true);
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["addStockEntry"])({
                item_id: restockModal.id,
                type: "restock",
                quantity: Number(restockQty),
                buy_price: restockModal.buy_price,
                sell_price: restockModal.sell_price
            });
            setRestockModal(null);
            setRestockQty("");
            const items = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getItems"])();
            setLowItems(items.filter((i)=>i.is_low));
            setLowCount(items.filter((i)=>i.is_low).length);
        } finally{
            setRestocking(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            maxWidth: 384,
            margin: "0 auto",
            minHeight: "100vh",
            background: "#F7F8F5",
            paddingBottom: 100
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    background: "linear-gradient(160deg, #052e16 0%, #0A3D2E 50%, #166534 100%)",
                    padding: "56px 20px 36px",
                    position: "relative",
                    overflow: "hidden"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            position: "absolute",
                            top: -60,
                            right: -40,
                            width: 200,
                            height: 200,
                            borderRadius: "50%",
                            background: "rgba(255,255,255,0.04)"
                        }
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 99,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            position: "absolute",
                            bottom: -30,
                            left: -20,
                            width: 120,
                            height: 120,
                            borderRadius: "50%",
                            background: "rgba(255,255,255,0.03)"
                        }
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 100,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            position: "relative"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                style: {
                                    color: "#6EE7B7",
                                    fontSize: 11,
                                    fontWeight: 700,
                                    letterSpacing: "0.2em",
                                    textTransform: "uppercase",
                                    margin: "0 0 6px"
                                },
                                children: "Welcome to"
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 102,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                style: {
                                    fontFamily: "var(--font-playfair), serif",
                                    color: "white",
                                    fontSize: 40,
                                    fontWeight: 900,
                                    lineHeight: 1,
                                    margin: "0 0 4px"
                                },
                                children: "Appa's Store"
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 103,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                style: {
                                    fontFamily: "var(--font-playfair), serif",
                                    color: "#34D399",
                                    fontSize: 18,
                                    fontWeight: 700,
                                    margin: "0 0 6px"
                                },
                                children: "Manager"
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 104,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                style: {
                                    color: "rgba(255,255,255,0.4)",
                                    fontSize: 12,
                                    fontWeight: 500,
                                    margin: 0
                                },
                                children: new Date().toLocaleDateString("en-IN", {
                                    weekday: "long",
                                    day: "numeric",
                                    month: "long"
                                })
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 105,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 101,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 98,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    padding: "24px 16px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 14
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Card, {
                        onClick: ()=>router.push("/udhaar"),
                        gradient: "linear-gradient(135deg, #052e16, #166534)",
                        emoji: "📒",
                        tag: "Customer Credit",
                        title: "Udhaar Book",
                        linkColor: "#166534",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatRow, {
                            left: {
                                label: "Total Pending",
                                value: `₹${totalPending.toFixed(0)}`,
                                color: "#EF4444"
                            },
                            right: {
                                label: "Customers Due",
                                value: `${pendingCount}`,
                                color: "#111827"
                            }
                        }, void 0, false, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 115,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 114,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Card, {
                        onClick: ()=>router.push("/stock"),
                        gradient: "linear-gradient(135deg, #1e3a5f, #2563EB)",
                        emoji: "📦",
                        tag: "Inventory",
                        title: "Stock Book",
                        linkColor: "#2563EB",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatRow, {
                            left: {
                                label: "Items Tracked",
                                value: `${itemCount}`,
                                color: "#111827"
                            },
                            right: {
                                label: "Low Stock",
                                value: `${lowCount}`,
                                color: lowCount > 0 ? "#EF4444" : "#16A34A"
                            }
                        }, void 0, false, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 123,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 122,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Card, {
                        onClick: ()=>router.push("/billing"),
                        gradient: "linear-gradient(135deg, #064e3b, #059669)",
                        emoji: "🧾",
                        tag: "Point of Sale",
                        title: "New Bill",
                        linkColor: "#059669",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatRow, {
                            left: {
                                label: "Today's Sales",
                                value: `₹${todayRevenue.toFixed(0)}`,
                                color: "#059669"
                            },
                            right: {
                                label: "Today's Profit",
                                value: `₹${todayProfit.toFixed(0)}`,
                                color: "#16A34A"
                            }
                        }, void 0, false, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 131,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 130,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Card, {
                        onClick: ()=>router.push("/profit"),
                        gradient: "linear-gradient(135deg, #713f12, #ca8a04)",
                        emoji: "📊",
                        tag: "Earnings",
                        title: "Profit Report",
                        linkColor: "#ca8a04",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                padding: "16px 20px"
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                style: {
                                    fontSize: 13,
                                    color: "#9CA3AF",
                                    fontWeight: 500,
                                    margin: 0
                                },
                                children: "Daily, monthly and yearly profit from real sales"
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 140,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 139,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 138,
                        columnNumber: 9
                    }, this),
                    lowItems.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            background: "white",
                            borderRadius: 24,
                            border: "1.5px solid #FECACA",
                            boxShadow: "0 2px 16px rgba(0,0,0,0.05)",
                            overflow: "hidden"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    background: "linear-gradient(135deg, #7f1d1d, #dc2626)",
                                    padding: "16px 20px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                style: {
                                                    color: "#FCA5A5",
                                                    fontSize: 11,
                                                    fontWeight: 700,
                                                    letterSpacing: "0.15em",
                                                    textTransform: "uppercase",
                                                    margin: "0 0 2px"
                                                },
                                                children: "Needs Restocking"
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 149,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                style: {
                                                    fontFamily: "var(--font-playfair), serif",
                                                    color: "white",
                                                    fontSize: 20,
                                                    fontWeight: 900,
                                                    margin: 0
                                                },
                                                children: "⚠ Low Stock Alert"
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 150,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 148,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontSize: 28
                                        },
                                        children: "📦"
                                    }, void 0, false, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 152,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 147,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    lowItems.slice(0, 5).map((item, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "space-between",
                                                        padding: "12px 20px"
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    style: {
                                                                        fontWeight: 700,
                                                                        fontSize: 14,
                                                                        color: "#111827",
                                                                        margin: "0 0 2px"
                                                                    },
                                                                    children: item.name
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/page.tsx",
                                                                    lineNumber: 159,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    style: {
                                                                        fontSize: 12,
                                                                        color: "#EF4444",
                                                                        fontWeight: 600,
                                                                        margin: 0
                                                                    },
                                                                    children: [
                                                                        "Only ",
                                                                        item.current_stock,
                                                                        " ",
                                                                        item.unit,
                                                                        " left"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/page.tsx",
                                                                    lineNumber: 160,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 158,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>setRestockModal(item),
                                                            style: {
                                                                background: "#FEF2F2",
                                                                border: "1.5px solid #FECACA",
                                                                borderRadius: 10,
                                                                padding: "7px 14px",
                                                                fontSize: 12,
                                                                fontWeight: 700,
                                                                color: "#DC2626",
                                                                cursor: "pointer",
                                                                fontFamily: "var(--font-jakarta), sans-serif"
                                                            },
                                                            children: "+ Restock"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 162,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 157,
                                                    columnNumber: 19
                                                }, this),
                                                idx < Math.min(lowItems.length, 5) - 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        height: 1,
                                                        background: "#FEF2F2",
                                                        margin: "0 20px"
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 169,
                                                    columnNumber: 62
                                                }, this)
                                            ]
                                        }, item.id, true, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 156,
                                            columnNumber: 17
                                        }, this)),
                                    lowItems.length > 5 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            padding: "10px 20px",
                                            borderTop: "1px solid #FEF2F2"
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>router.push("/stock"),
                                            style: {
                                                background: "none",
                                                border: "none",
                                                color: "#DC2626",
                                                fontWeight: 700,
                                                fontSize: 12,
                                                cursor: "pointer",
                                                fontFamily: "var(--font-jakarta), sans-serif"
                                            },
                                            children: [
                                                "+",
                                                lowItems.length - 5,
                                                " more low stock items →"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 174,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 173,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 154,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 146,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Card, {
                        onClick: ()=>router.push("/summary"),
                        gradient: "linear-gradient(135deg, #1e1b4b, #4338ca)",
                        emoji: "📋",
                        tag: "End of Day",
                        title: "Daily Summary",
                        linkColor: "#4338ca",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                padding: "16px 20px"
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                style: {
                                    fontSize: 13,
                                    color: "#9CA3AF",
                                    fontWeight: 500,
                                    margin: 0
                                },
                                children: "Today's bills, revenue, profit and top sellers"
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 186,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 185,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 184,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Card, {
                        onClick: ()=>router.push("/suppliers"),
                        gradient: "linear-gradient(135deg, #134e4a, #0d9488)",
                        emoji: "🚚",
                        tag: "Stock Purchases",
                        title: "Supplier Log",
                        linkColor: "#0d9488",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                padding: "16px 20px"
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                style: {
                                    fontSize: 13,
                                    color: "#9CA3AF",
                                    fontWeight: 500,
                                    margin: 0
                                },
                                children: "Track supplier payments and monthly stock expenses"
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 192,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 191,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 190,
                        columnNumber: 9
                    }, this),
                    restockModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        onClick: (e)=>e.target === e.currentTarget && setRestockModal(null),
                        style: {
                            position: "fixed",
                            inset: 0,
                            background: "rgba(0,0,0,0.5)",
                            backdropFilter: "blur(4px)",
                            display: "flex",
                            alignItems: "flex-end",
                            zIndex: 999
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                background: "white",
                                width: "100%",
                                maxWidth: 384,
                                margin: "0 auto",
                                borderRadius: "28px 28px 0 0",
                                padding: "20px 20px 40px",
                                boxShadow: "0 -8px 40px rgba(0,0,0,0.15)"
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        width: 36,
                                        height: 4,
                                        background: "#E5E7EB",
                                        borderRadius: 4,
                                        margin: "0 auto 24px"
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 200,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    style: {
                                        fontFamily: "var(--font-playfair), serif",
                                        fontWeight: 900,
                                        fontSize: 20,
                                        color: "#111827",
                                        margin: "0 0 4px"
                                    },
                                    children: "Restock"
                                }, void 0, false, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 201,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    style: {
                                        fontSize: 13,
                                        color: "#9CA3AF",
                                        margin: "0 0 20px"
                                    },
                                    children: [
                                        restockModal.name,
                                        " — currently ",
                                        restockModal.current_stock,
                                        " ",
                                        restockModal.unit
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 202,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    style: {
                                        fontSize: 11,
                                        fontWeight: 700,
                                        color: "#9CA3AF",
                                        letterSpacing: "0.15em",
                                        textTransform: "uppercase",
                                        margin: "0 0 8px"
                                    },
                                    children: [
                                        "Quantity Added (",
                                        restockModal.unit,
                                        ")"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 204,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "number",
                                    placeholder: "0",
                                    value: restockQty,
                                    onChange: (e)=>setRestockQty(e.target.value),
                                    autoFocus: true,
                                    style: {
                                        width: "100%",
                                        border: "2px solid #F3F4F6",
                                        borderRadius: 14,
                                        padding: "14px 16px",
                                        fontSize: 32,
                                        fontWeight: 900,
                                        color: "#111827",
                                        outline: "none",
                                        boxSizing: "border-box",
                                        fontFamily: "var(--font-jakarta), sans-serif",
                                        marginBottom: 20
                                    },
                                    onFocus: (e)=>e.target.style.borderColor = "#DC2626",
                                    onBlur: (e)=>e.target.style.borderColor = "#F3F4F6"
                                }, void 0, false, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 207,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: "flex",
                                        gap: 10
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>{
                                                setRestockModal(null);
                                                setRestockQty("");
                                            },
                                            style: {
                                                flex: 1,
                                                border: "2px solid #F3F4F6",
                                                background: "white",
                                                borderRadius: 14,
                                                padding: "14px 0",
                                                fontSize: 14,
                                                fontWeight: 700,
                                                color: "#9CA3AF",
                                                cursor: "pointer",
                                                fontFamily: "var(--font-jakarta), sans-serif"
                                            },
                                            children: "Cancel"
                                        }, void 0, false, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 215,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: handleRestock,
                                            disabled: restocking || !restockQty,
                                            style: {
                                                flex: 1,
                                                border: "none",
                                                background: "linear-gradient(135deg, #7f1d1d, #dc2626)",
                                                borderRadius: 14,
                                                padding: "14px 0",
                                                fontSize: 14,
                                                fontWeight: 800,
                                                color: "white",
                                                cursor: "pointer",
                                                opacity: restocking || !restockQty ? 0.5 : 1,
                                                fontFamily: "var(--font-jakarta), sans-serif"
                                            },
                                            children: restocking ? "Saving..." : "Restock"
                                        }, void 0, false, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 216,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 214,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 199,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 198,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 111,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/page.tsx",
        lineNumber: 96,
        columnNumber: 5
    }, this);
}
_s(Landing, "i70UstBs7uTOSIq9MsEuBYf6w7s=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = Landing;
var _c;
__turbopack_context__.k.register(_c, "Landing");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_0ciq1cm._.js.map