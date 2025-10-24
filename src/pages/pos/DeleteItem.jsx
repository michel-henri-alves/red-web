import { useState } from 'react';
import { useTranslation } from 'react-i18next'
import ActionButton from '../../components/ActionButton';
import FormInput from '../../components/FormInput';
import {
    ListX,
    X
} from "lucide-react";


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
                <FormInput
                    type="number"
                    label={t("insert.item.number.for.delete")}
                    onChange={(e) => setItemId(e.target.value)}
                    placeholder={t("placeholder.insert.item.number.for.delete")}
                    icon={ListX}
                />
                <ActionButton type="button" bgColor="[rgba(98,70,234)]" text={t("button.delete")} onClick={deleteItem} icon={X} additionalStyle="mt-10" />

            </div>
        </div>
    );
}
