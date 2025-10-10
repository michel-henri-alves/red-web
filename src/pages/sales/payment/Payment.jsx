import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next'
import { createSale } from '../../../shared/hooks/useSales'
import { useKeyboardShortcut } from "../../../hooks/useKeyboardShortcut";
import { useNavigate } from "react-router-dom";
import FormInput from '../../../components/FormInput';
import Modal from '../../../components/Modal';
import CustomerList from '../../customer/CustomerList';
import CustomerAddDue from './CustomerAddDue';

export default function Payment({ total }) {

    const navigate = useNavigate();
    const { t } = useTranslation();

    const {
        mutate: creation,
        isLoading: isLoadingCreation,
        isSuccess: isSuccessCreation,
        isError: isErrorCreation,
        error: errorCreation,
        reset: resetCreation,
    } = createSale();

    const [errors, setErrors] = useState({});
    const [payed, setPayed] = useState(0);
    const [paying, setPaying] = useState(0);
    const [due, setDue] = useState(total);
    const [change, setChange] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState([]);
    const [amountPaid, setAmountPaid] = useState([]);
    const [isOpenRegisterDue, setOpenRegisterDue] = useState(false);


    const btn1Ref = useRef(null);
    const btn2Ref = useRef(null);
    const btn3Ref = useRef(null);
    const btn4Ref = useRef(null);
    const btn5Ref = useRef(null);
    const btn6Ref = useRef(null);

    useKeyboardShortcut(["F1"], () => {
        btn1Ref.current?.click();
    });

    useKeyboardShortcut(["F2"], () => {
        btn2Ref.current?.click();
    });

    useKeyboardShortcut(["F3"], () => {
        btn3Ref.current?.click();
    });

    useKeyboardShortcut(["F4"], () => {
        btn4Ref.current?.click();
    });

    useKeyboardShortcut(["F5"], () => {
        btn5Ref.current?.click();
    });

    useKeyboardShortcut(["F6"], () => {
        btn6Ref.current?.click();
    });




    const inputRef = useRef(null);

    const handleChange = (e) => {
        let val = e.target.value.replace(/\D/g, "");

        if (!val) {
            setPaying(0);
            return;
        }

        const num = parseFloat(val) / 100;
        setPaying(num);
    };

    useEffect(() => {
        const input = inputRef.current;
        if (input) {
            const length = input.value.length;
            input.setSelectionRange(length, length);
        }
    }, [payed]);

    const setTotalValueForPay = () => {
        setPaying(due);
    }

    const [selected, setSelected] = useState("debit");

    const options = [
        { label: t("debit"), value: "debit", color: "bg-red-400 hover:bg-red-600", icon: "💳", ref: btn1Ref },
        { label: t("credit"), value: "credit", color: "bg-green-400 hover:bg-green-600", icon: "💳", ref: btn2Ref },
        { label: t("money"), value: "money", color: "bg-yellow-400 hover:bg-yellow-600", icon: "💵", ref: btn3Ref },
        { label: t("pix"), value: "pix", color: "bg-cyan-400 hover:bg-cyan-600", icon: "❖", ref: btn4Ref },
        { label: t("pay.later"), value: "pay.later", color: "bg-blue-400 hover:bg-blue-600", icon: "📝", ref: btn6Ref },
    ];

    const handlePendingDebtRegister = () => {
        console.log("aaa")
        setOpenRegisterDue(true)
    }

    const updateBill = () => {

        setPayed(payed + paying);
        var result = due - paying;

        var newAmountPaid = [...amountPaid, paying];
        var newPaymentMethod = [...paymentMethod, selected];

        setAmountPaid(newAmountPaid);
        setPaymentMethod(newPaymentMethod);

        console.log("teste ", selected)


        if (result === 0) {
            creation(
                {
                    paymentMethod: newPaymentMethod,
                    amountPaid: newAmountPaid,
                    change: change,
                    realizedAt: Date.now(),
                }, {
                onSuccess: () => {
                    //msg de sucesso, fecha o modal e limpa a tela de venda
                    navigate("/pos");
                    toast.success(t("toast.sales.finished"));
                },
                onError: (error) => {
                    navigate("/pos");
                    console.error(error);
                    toast.error(t("toast.creation.error", { description: t("sales"), errorCause: error.response.data.error }));
                },
            });

        } else if (result > 0) {
            setDue(result);
            toast.success(t("toast.discounted.value", { input: payed, due: result }));
            // msg de continuar com pagamento

        } else if (result < 0) {
            //mostra o troco
            setDue(0);
            setChange(-result);
            toast.success(t("toast.change.value", { input: paying, change: -result }));
        }

        setPaying(0.00);
    }


    const handleSale = () => {


        if (selected === "pay.later") {

            handlePendingDebtRegister()
            // return
        } else {
            updateBill()
        }

        // setPayed(payed + paying);
        // var result = due - paying;

        // var newAmountPaid = [...amountPaid, paying];
        // var newPaymentMethod = [...paymentMethod, selected];

        // setAmountPaid(newAmountPaid);
        // setPaymentMethod(newPaymentMethod);

        // console.log("teste ", selected)



        // if (result === 0) {
        //     creation(
        //         {
        //             paymentMethod: newPaymentMethod,
        //             amountPaid: newAmountPaid,
        //             change: change,
        //             realizedAt: Date.now(),
        //         }, {
        //         onSuccess: () => {
        //             //msg de sucesso, fecha o modal e limpa a tela de venda
        //             navigate("/sales");
        //             toast.success(t("toast.sales.finished"));
        //         },
        //         onError: (error) => {
        //             navigate("/sales");
        //             console.error(error);
        //             toast.error(t("toast.creation.error", { description: t("sales"), errorCause: error.response.data.error }));
        //         },
        //     });

        // } else if (result > 0) {
        //     setDue(result);
        //     toast.success(t("toast.discounted.value", { input: payed, due: result }));
        //     // msg de continuar com pagamento

        // } else if (result < 0) {
        //     //mostra o troco
        //     setDue(0);
        //     setChange(-result);
        //     toast.success(t("toast.change.value", { input: paying, change: -result }));
        // }

        // setPaying(0.00);
    }

    const changePayed = () => {
        //salva no banco
        creation(
            {
                paymentMethod: paymentMethod,
                amountPaid: amountPaid,
                change: change,
                realizedAt: Date.now(),
            }, {
            onSuccess: () => {
                //msg de sucesso, fecha o modal e limpa a tela de venda
                navigate("/pos");
                toast.success(t("toast.sales.finished"));
            },
            onError: (error) => {
                navigate("/pos");
                console.error(error);
                toast.error(t("toast.creation.error", { description: t("sales"), errorCause: error.response.data.error }));
            },
        });

    }

    const closeRegisterDue = () => {
        setOpenRegisterDue(false);
        // setFocusActive(true);
        // inputRef.current?.focus();
    }


    return (
        <div>
            <div className="p-6 bg-gray-50 rounded-xl shadow-2xl shadow-[4px_0_6px_rgba(0,0,0,0.25),0_4px_6px_rgba(0,0,0,0.25)] mb-4">
                <h1 className="text-2xl font-bold text-gray-800 text-center mb-4">
                    {t("sales.final.bill")}
                </h1>
                <h1 className="text-2xl font-bold text-center text-red-600">{t("sales.bill.total")}: {t("currency")} {total.toFixed(2)}</h1>
                <h1 className="text-2xl font-bold text-center text-green-600">{t("payed")}: {t("currency")} {payed.toFixed(2)}</h1>
                <h1 className="text-2xl font-bold text-center text-yellow-600">{t("discount")}: {t("currency")} {discount.toFixed(2)}</h1>

                <div className="border-t pt-2">
                    {change === 0
                        ? <h1 className="text-2xl font-bold text-center text-blue-600">{t("due")}: {t("currency")} {due.toFixed(2)}</h1>
                        : <button
                            className="flex-1 px-4 py-2  rounded-xl bg-orange-500 text-white hover:bg-orange-600 transition-colors text-xl items-center cursor-pointer ml-4"
                            onClick={changePayed}>
                            {t("toast.change.value", { input: payed.toFixed(2), change: change.toFixed(2) })}
                        </button>
                    }
                </div>

            </div>

            <div className="p-6 bg-gray-50 rounded-lg rounded-xl shadow-2xl shadow-[4px_0_6px_rgba(0,0,0,0.25),0_4px_6px_rgba(0,0,0,0.25)] mb-4">
                <h1 className="text-xl font-bold text-gray-800 text-center mb-4">
                    {t("sales.payment.options")}
                </h1>

                <div className="flex flex-wrap gap-4 justify-center">
                    {options.map((option) => (
                        <div
                            key={option.value}
                            onClick={() => setSelected(option.value)}
                            ref={option.ref}
                            className={`
          flex items-center justify-center p-4 rounded-lg cursor-pointer transition-all 
          ${option.color}
          ${selected === option.value ? `ring-2 ring-offset-2 ring-blue-500 scale-150` : ""}`
                            }
                        >
                            <input
                                type="radio"
                                name="payment"
                                value={option.value}
                                checked={selected === option.value}
                                onChange={() => { }}
                                className="hidden"
                            />
                            <span className="font-medium flex items-center gap-2">{option.icon} {option.label}</span>
                        </div>
                    ))}
                </div>
            </div>


            <div className="grid place-items-center p-6 bg-gray-50 rounded-xl shadow-2xl shadow-[4px_0_6px_rgba(0,0,0,0.25),0_4px_6px_rgba(0,0,0,0.25)]">
                <div>
                    <div>
                        <FormInput
                            label={t("sales.payed")}
                            value={paying.toFixed(2)}
                            onChange={handleChange}
                            placeholder="0.00"
                            icon="💲"
                            type="number"
                        />
                    </div>
                </div>
                <div className="flex space-x-2 pt-2">
                    <button type="button"
                        onClick={setTotalValueForPay}
                        disabled={change > 0}
                        className={`flex-1 px-4 py-2 rounded-xl ml-4  text-xl items-center 
                            ${change > 0 ? "bg-gray-400" : "bg-orange-500 text-white hover:bg-orange-600 transition-colors cursor-pointer"}`}>
                        ➤ {t("autocomplete")}
                    </button>
                    <button
                        disabled={paying === 0 || change > 0}
                        className={`ml-2 px-4 py-2 rounded text-white 
                        ${paying === 0 || change > 0 ? "bg-gray-400" : "flex-1 px-4 py-2  rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition-colors text-xl flex items-center gap-2 cursor-pointer"}`}
                        onClick={handleSale}>
                        🤝 {t("receive")}
                    </button>
                    <button
                        disabled={paying === 0 || change > 0}
                        className={`ml-2 px-4 py-2 rounded text-white 
                        ${change > 0 ? "bg-gray-400" : "flex-1 px-4 py-2  rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition-colors text-xl flex items-center gap-2 cursor-pointer"}`}
                        onClick={handleSale}>
                        💸 {t("discount")}
                    </button>
                </div>
            </div>

            <Modal
                title={t("sales.select.customer")}
                isOpen={isOpenRegisterDue}
                onClose={closeRegisterDue}
            // closeButtonRef={btn7Ref}
            >
                <CustomerList
                    renderExpandedDiv={(customer, isExpanded) => <CustomerAddDue updateBill={updateBill} onClose={closeRegisterDue} customer={customer} due={paying} isExpanded={isExpanded} />} />
            </Modal>

        </div>
    );
}
