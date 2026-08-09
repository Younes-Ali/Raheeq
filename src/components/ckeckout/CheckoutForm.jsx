import { ErrorMessage, Field, Form, Formik } from 'formik'
import React from 'react'
import FullField from './FullField'
import * as Yup from "yup";
import { useCartStore } from '../../store/cartStore';
import { useNavigate } from 'react-router-dom';
import { GOVERNORATES } from '../../data/governorates'
import toast from 'react-hot-toast';

const checkoutSchema = Yup.object({
    name: Yup.string()
        .min(3, "Name is too short")
        .required("Name is required"),

    phone: Yup.string()
        .matches(/^01[0125][0-9]{8}$/, "Enter a valid Egyptian phone number")
        .required("Phone number is required"),

    email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),

    address: Yup.string()
        .min(10, "Please enter a complete address")
        .required("Address is required"),

    governorate: Yup.string().required("Please select your governorate"),
    customGovernorate: Yup.string().when("governorate",
        {
            is: "Other", then: (schema) =>
                schema.min(2, "Please enter a valid governorate")
                    .required("Please enter your governorate"),
            otherwise: (schema) => schema.notRequired(),
        }),

    note: Yup.string(),
});

export default function CheckoutForm({ total, cartItems }) {

    const navigate = useNavigate();

    const clearCart = useCartStore((state) => state.clearCart);


    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const finalGovernorate =
                values.governorate === "Other"
                    ? values.customGovernorate
                    : values.governorate;
            const order = {
                customerName: values.name,
                phone: values.phone,
                email: values.email,
                address: values.address,
                governorate: finalGovernorate,
                note: values.note,

                paymentMethod: "cash_on_delivery",

                items: cartItems,

                total,
            };

            console.log("Order:", order);

            /*
              TODO:
              لما نجهز Strapi:
      
              await createOrder(order);
            */

            // مؤقتًا بنعتبر الطلب نجح
            clearCart();
            toast.success(
                `your order sent successfuly`
            );

            navigate("/cart");
        } catch (error) {
            console.error("Order error:", error);
        } finally {
            setSubmitting(false);
        }
    };
    return (
        <section
            className="
            p-6 sm:p-8
            bg-[var(--dark-green-soft)]
            rounded-[28px] border border-[rgba(242,234,217,0.12)]
          "
        >
            <h2
                className="
                mb-8
                text-2xl text-[var(--beige)]
                display
              "
            >
                Your Details
            </h2>

            <Formik
                initialValues={{
                    name: "",
                    phone: "",
                    email: "",
                    address: "",
                    note: "",
                }}
                validationSchema={checkoutSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting }) => (
                    <Form
                        className="
                        space-y-6
                      "
                    >

                        <FullField label={"Full Name"} name={"name"} type={"text"} placeholder={"Enter your full name"} />

                        <FullField label={"Phone"} name={'phone'} type={"tel"} placeholder={"Enter your phone number"} inputMode={"numeric"} maxLength={11} />

                        <FullField label={"Email"} name={"email"} type={"email"} placeholder={"you@example.com"} />

                        <FullField label={"Delivery Address"} name={"address"} as={"textarea"} rows={"4"} placeholder={"Enter your complete address"} />
                        <div>
                            <label
                                htmlFor="governorate"
                                className="
                                block
                                mb-2
                                text-sm text-[var(--beige)]
                              "
                            >
                                Governorate
                            </label>

                            <Field
                                as="select"
                                id="governorate"
                                name="governorate"
                                className="
                                w-full
                                px-5 py-4
                                text-sm text-black
                                bg-[var(--beige)]
                                rounded-2xl
                                border border-[rgba(242,234,217,0.15)] focus:border-[var(--beige)]
                                outline-none
                                transition
                              "
                            >
                                <option
                                    value=""
                                    className="
                                    text-black/40
                                  "
                                >
                                    Select your governorate
                                </option>

                                {GOVERNORATES.map((governorate) => (
                                    <option
                                        key={governorate}
                                        value={governorate}
                                        className="
                                        bg-[var(--beige)]
                                      "
                                    >
                                        {governorate}
                                    </option>
                                ))}

                                <option
                                    value="Other"
                                    className="
                                    bg-[var(--beige)]
                                  "
                                >
                                    Other / Not listed
                                </option>
                            </Field>

                            <ErrorMessage
                                name="governorate"
                                component="p"
                                className="
                                mt-2
                                text-xs text-red-300
                              "
                            /
                            >
                        </div>

                        <Field name="governorate">
                            {({ field }) =>
                                field.value === "Other" ? (
                                    <div>
                                        <label
                                            htmlFor="customGovernorate"
                                            className="
                                            block
                                            mb-2
                                            text-sm text-[var(--beige)]
                                          "
                                        >
                                            Enter Your Governorate
                                        </label>

                                        <Field
                                            id="customGovernorate"
                                            name="customGovernorate"
                                            type="text"
                                            placeholder="Enter your governorate"
                                            className="
                                            w-full
                                            px-5 py-4
                                            text-sm text-black placeholder:text-black/40
                                            bg-[var(--beige)]
                                            rounded-2xl
                                            border border-[rgba(242,234,217,0.15)] focus:border-[var(--beige)]
                                            outline-none
                                            transition
                                          "
                                        /
                                        >

                                        <ErrorMessage
                                            name="customGovernorate"
                                            component="p"
                                            className="
                                            mt-2
                                            text-xs text-red-300
                                          "
                                        /
                                        >
                                    </div>
                                ) : null
                            }
                        </Field>

                        <FullField label={"Note"} name={"note"} as={"textarea"} rows={"3"} placeholder={"Any special instructions?"} optional={true} />

                        <div
                            className="
                            p-5
                            bg-[var(--beige)]
                            rounded-2xl border border-[rgba(242,234,217,0.12)]
                          "
                        >
                            <p
                                className="
                                mb-4
                                text-sm font-medium
                              "
                            >
                                Payment Method
                            </p>

                            <div
                                className="
                                flex items-center
                                gap-3
                              "
                            >

                                <div
                                    className="
                                    flex items-center justify-center
                                    h-5 w-5
                                    rounded-full border border-black
                                  "
                                >
                                    <div
                                        className="
                                        h-2.5 w-2.5
                                        bg-black
                                        rounded-full
                                      "
                                    /
                                    >
                                </div>

                                <div>
                                    <p
                                        className="
                                        text-sm
                                      "
                                    >
                                        Cash on Delivery
                                    </p>

                                    <p
                                        className="
                                        mt-1
                                        text-xs text-black/50
                                      "
                                    >
                                        Pay when your order arrives.
                                    </p>
                                </div>

                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="
                            w-full
                            px-6 py-4
                            text-sm text-[var(--dark-green)] font-medium
                            bg-[var(--beige)] hover:bg-yellow-300
                            rounded-full
                            transition-all duration-300 disabled:opacity-40
                            hover:scale-[1.02] active:scale-[0.98]
                            disabled:cursor-not-allowed
                          "
                        >
                            {isSubmitting
                                ? "Placing Order..."
                                : "Order Now"}
                        </button>

                    </Form>
                )}
            </Formik>
        </section>
    )
}
