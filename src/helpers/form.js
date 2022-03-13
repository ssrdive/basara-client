import { apiAuth } from '../basara-api';

export const loadDropdownGeneric = async (type, name, setForm) => {
    try {
        const response = await apiAuth.get(`/dropdown/${type}`);
        setForm((prevForm) => {
            const updatedForm = {
                ...prevForm,
                [name]: { ...prevForm[name], options: response.data, value: response.data[0].id },
            };
            return updatedForm;
        });
    } catch (err) {
        console.log(err);
    }
};

export const loadDropdownConditionGeneric = async (type, name, where, value, setForm) => {
    try {
        const response = await apiAuth.get(`/dropdown/condition/${type}/${where}/${value}`);
        if (response.data != null && response.data.length != 0) {
            setForm((prevForm) => {
                const updatedForm = {
                    ...prevForm,
                    [name]: { ...prevForm[name], options: response.data, value: response.data[0].id },
                };
                return updatedForm;
            });
        }
    } catch (err) {
        console.log(err);
    }
};

export const loadDropdownMultiConditionGeneric = async (type, name, where, value, operator, setForm) => {
    try {
        const response = await apiAuth.get(`/dropdown/multicondition/${type}/${where}/${value}/${operator}`);
        if (response.data != null && response.data.length != 0) {
            setForm((prevForm) => {
                const updatedForm = {
                    ...prevForm,
                    [name]: { ...prevForm[name], options: response.data, value: response.data[0].id },
                };
                return updatedForm;
            });
        }
    } catch (err) {
        console.log(err);
    }
};

export const loadDropdownAccountGeneric = async (type, name, where, value, setForm) => {
    try {
        const response = await apiAuth.get(`/dropdown/condition/accounts/${type}/${where}/${value}`);
        setForm((prevForm) => {
            const updatedForm = {
                ...prevForm,
                [name]: { ...prevForm[name], options: response.data, value: response.data[0].id },
            };
            return updatedForm;
        });
    } catch (err) {
        console.log(err);
    }
};

export const loadDropdownAccountWithChildGeneric = async (
    type,
    name,
    child_type,
    child_name,
    child_where,
    where,
    value,
    setForm
) => {
    try {
        const response = await apiAuth.get(`/dropdown/condition/accounts/${type}/${where}/${value}`);
        setForm((prevForm) => {
            const updatedForm = {
                ...prevForm,
                [name]: { ...prevForm[name], options: response.data, value: response.data[0].id },
            };
            return updatedForm;
        });
        loadDropdownAccountGeneric(child_type, child_name, child_where, response.data[0].id, setForm);
    } catch (err) {
        console.log(err);
    }
};

export const loadDiscountType = (setForm) => {
    const discountTypeOptions = [
        { id: 'per', name: 'Percentage' },
        { id: 'amt', name: 'Amount' },
    ];

    try {
        setForm((prevForm) => {
            const updatedForm = {
                ...prevForm,
                ['discountType']: { ...prevForm['discountType'], options: discountTypeOptions, value: 'per' },
            };
            return updatedForm;
        });
    } catch (err) {
        console.log(err);
    }
};

export const loadDropdownGRNGeneric = async (name, setForm) => {
    try {
        const response = await apiAuth.get(`/dropdown/custom/grn`);

        if (response.data != null && response.data.length != 0) {
            setForm((prevForm) => {
                const updatedForm = {
                    ...prevForm,
                    [name]: { ...prevForm[name], options: response.data, value: response.data[0].id },
                };
                return updatedForm;
            });
        }
    } catch (err) {
        console.log(err);
    }
};

export const loadOptionalDropdownGeneric = async (type, name, label, setForm) => {
    try {
        const response = await apiAuth.get(`/dropdown/${type}`);
        setForm(prevForm => {
            const updatedForm = {
                ...prevForm,
                [name]: { ...prevForm[name], options: [{ id: "", name: `Select ${label}`},...response.data], value: "" },
            };
            return updatedForm;
        });
    } catch (err) {
        console.log(err);
    }
};