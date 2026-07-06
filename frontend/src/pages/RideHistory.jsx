import React, { useEffect, useState } from "react";
import axios from "axios";
import RideHistoryHeader from "../components/RideHistoryHeader";
import RideHistoryCard from "../components/RideHistoryCard";
import RideHistorySkeleton from "../components/RideHistorySkeleton";
import EmptyRideHistory from "../components/EmptyRideHistory";
import RideStatistics from "../components/RideStatistics";
import RideStatusFilter from "../components/RideStatusFilter";
import RideSortDropdown from "../components/RideSortDropdown";

const RideHistory = () => {
    const [rides, setRides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("All");
    const [sortBy, setSortBy] = useState("newest");

    useEffect(() => {
        const fetchRideHistory = async () => {
            try {
                const token = localStorage.getItem("token");

                const { data } = await axios.get(
                    `${import.meta.env.VITE_BASE_URL}/rides/history`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                console.log("Ride History Response:", data);

                setRides(data.rides || []);
            } catch (err) {
                console.error(err);
                setError("Failed to load ride history.");
            } finally {
                setLoading(false);
            }
        };

        fetchRideHistory();
    }, []);

    const filteredRides = rides
        .filter((ride) => {

            const query = search.toLowerCase();

            const matchesSearch =
                ride.pickup.toLowerCase().includes(query) ||
                ride.destination.toLowerCase().includes(query);

            const matchesStatus =
                selectedStatus === "All"
                    ? true
                    : ride.status.toLowerCase() === selectedStatus.toLowerCase();

            return matchesSearch && matchesStatus;

        })
        .sort((a, b) => {

            switch (sortBy) {

                case "oldest":
                    return new Date(a.createdAt) - new Date(b.createdAt);

                case "highestFare":
                    return b.fare - a.fare;

                case "lowestFare":
                    return a.fare - b.fare;

                case "newest":
                default:
                    return new Date(b.createdAt) - new Date(a.createdAt);

            }

        });

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-100">

                <RideHistoryHeader
                    totalRides={0}
                    search=""
                    setSearch={() => { }}
                />

                <div className="p-5 space-y-5">
                    <RideHistorySkeleton />
                    <RideHistorySkeleton />
                    <RideHistorySkeleton />
                    <RideHistorySkeleton />
                </div>

            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen text-red-600">
                {error}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">

            <RideHistoryHeader
                totalRides={rides.length}
                search={search}
                setSearch={setSearch}
            />

            <div className="px-5 pt-5">
                <RideStatistics rides={rides} />
            </div>

            <div className="px-5 pt-5">
                <RideStatusFilter
                    selectedStatus={selectedStatus}
                    setSelectedStatus={setSelectedStatus}
                />
            </div>

            <div className="px-5 pt-4">
                <RideSortDropdown
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                />
            </div>

            <div className="p-5 space-y-5">

                {filteredRides.length === 0 ? (

                    <EmptyRideHistory />

                ) : (

                    filteredRides.map((ride) => (

                        <RideHistoryCard
                            key={ride._id}
                            ride={ride}
                            onClick={() => console.log("Selected Ride:", ride)}
                        />

                    ))

                )}

            </div>

        </div>
    );
};

export default RideHistory;