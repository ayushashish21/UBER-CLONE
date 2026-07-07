import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";


import RideDetailsHeader from "../components/RideDetailsHeader";
import RideSummaryCard from "../components/RideSummaryCard";
import CaptainCard from "../components/CaptainCard";
import PaymentCard from "../components/PaymentCard";
import RideTimeline from "../components/RideTimeline";

const RideDetails = () => {

    const { rideId } = useParams();
    const navigate = useNavigate();

    const [ride, setRide] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const fetchRide = async () => {

            try {

                const token = localStorage.getItem("token");

                const { data } = await axios.get(

                    `${import.meta.env.VITE_BASE_URL}/rides/${rideId}`,

                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }

                );

                setRide(data.ride);

            }

            catch (err) {

                console.error(err);

                setError("Unable to load ride.");

            }

            finally {

                setLoading(false);

            }

        };

        fetchRide();

    }, [rideId]);

    if (loading) {

        return (

            <div className="min-h-screen bg-slate-50">

                <div className="h-20 bg-white border-b animate-pulse"></div>

                <div className="space-y-5 p-5">

                    <div className="h-48 rounded-3xl bg-slate-200 animate-pulse"></div>

                    <div className="h-36 rounded-3xl bg-slate-200 animate-pulse"></div>

                    <div className="h-36 rounded-3xl bg-slate-200 animate-pulse"></div>

                    <div className="h-60 rounded-3xl bg-slate-200 animate-pulse"></div>

                </div>

            </div>

        );

    }

    if (error) {

        return (

            <div className="min-h-screen flex flex-col items-center justify-center">

                <h2 className="text-2xl font-bold text-red-600">

                    {error}

                </h2>

                <button

                    onClick={() => navigate(-1)}

                    className="mt-6 bg-black text-white px-6 py-3 rounded-xl"

                >

                    Go Back

                </button>

            </div>

        );

    }

    return (

        <div className="min-h-screen bg-slate-50">

            <RideDetailsHeader />

            <div className="space-y-5 p-5">

                <RideSummaryCard ride={ride} />

                <CaptainCard ride={ride} />

                <PaymentCard ride={ride} />

                <RideTimeline ride={ride} />

            </div>

        </div>

    );

};

export default RideDetails;