import React from "react";
import "remixicon/fonts/remixicon.css";

const PaymentCard = ({ ride }) => {
    const paymentStatusColor = {
        paid: "bg-emerald-100 text-emerald-700",
        pending: "bg-amber-100 text-amber-700",
        failed: "bg-red-100 text-red-700",
    };

    return (
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">

            <h2 className="font-bold text-lg mb-5">
                Payment
            </h2>

            <div className="space-y-4">

                <div className="flex justify-between items-center">

                    <div className="flex items-center gap-3">

                        <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center">
                            <i className="ri-wallet-3-fill text-xl text-slate-700" />
                        </div>

                        <div>
                            <p className="text-xs text-slate-500">
                                Payment Method
                            </p>

                            <p className="font-semibold capitalize">
                                {ride.paymentMethod}
                            </p>
                        </div>

                    </div>

                </div>

                <div className="flex justify-between items-center">

                    <div className="flex items-center gap-3">

                        <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center">
                            <i className="ri-bank-card-fill text-xl text-slate-700" />
                        </div>

                        <div>

                            <p className="text-xs text-slate-500">
                                Payment Status
                            </p>

                            <span
                                className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                                    paymentStatusColor[ride.paymentStatus] ||
                                    "bg-slate-100 text-slate-700"
                                }`}
                            >
                                {ride.paymentStatus}
                            </span>

                        </div>

                    </div>

                </div>

                <div className="flex justify-between items-center">

                    <div className="flex items-center gap-3">

                        <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center">
                            <i className="ri-money-rupee-circle-fill text-xl text-slate-700" />
                        </div>

                        <div>

                            <p className="text-xs text-slate-500">
                                Total Fare
                            </p>

                            <p className="font-bold text-xl">
                                ₹{ride.fare}
                            </p>

                        </div>

                    </div>

                </div>

                {ride.paymentID && (

                    <div className="border-t pt-4">

                        <p className="text-xs text-slate-500 mb-1">
                            Payment ID
                        </p>

                        <p className="font-mono text-sm break-all">
                            {ride.paymentID}
                        </p>

                    </div>

                )}

            </div>

        </div>
    );
};

export default PaymentCard;