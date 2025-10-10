import { useState } from 'react';
import { useTranslation } from 'react-i18next'


export default function DeleteItem({ handleDelete }) {

    const { t } = useTranslation();
    const [itemId, setItemId] = useState(0);

    const deleteItem = () => {
        var realItemIndex = itemId - 1
        handleDelete(realItemIndex)
    }

    return (
        <div>
            <div className="text-center p-6 bg-gray-50 rounded-lg shadow-md mb-4">
                <h1 className="text-2xl font-bold text-gray-800 text-center mb-4">
                    {t("insert.item.number.for.delete")}
                </h1>
                <input
                    type="number"
                    // value={payed.toFixed(2)}
                    // value={paying.toFixed(2)}
                    onChange={(e) => setItemId(e.target.value)}
                    placeholder="🗑️ Insira o número do item"
                    className="border border-gray-800 rounded p-2 text-right mb-4 mr-4"
                />
                <button
                    onClick={deleteItem}
                    className="bg-blue-600 text-white py-2 px-4 rounded 
                hover:bg-blue-700 active:bg-blue-200 transition cursor-pointer"
                >
                    🗑️ {t("button.delete")}
                </button>

            </div>
        </div>
    );
}
