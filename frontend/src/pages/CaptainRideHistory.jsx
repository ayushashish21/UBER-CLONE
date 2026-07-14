import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import RideHistoryHeader from "../components/RideHistoryHeader";
import RideStatusFilter from "../components/RideStatusFilter";
import RideDateRangeFilter from "../components/RideDateRangeFilter";
import RideSortDropdown from "../components/RideSortDropdown";
import RideHistorySkeleton from "../components/RideHistorySkeleton";
import EmptyRideHistory from "../components/EmptyRideHistory";
import CaptainRideHistoryCard from "../components/CaptainRideHistoryCard";

const CaptainRideHistory = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedRange, setSelectedRange] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Status and date range are filtered server-side (see /rides/captain-history).
  // Search and sort are cheap enough to do client-side over the fetched page.
  useEffect(() => {
    let cancelled = false;

    const fetchHistory = async () => {
      setLoading(true);

      try {
        // NOTE: assumes the captain's JWT is stored under the same "token" key
        // that RideHistoryCard.jsx uses for riders. If CaptainContext stores it
        // under a different key (e.g. "captain-token"), update this line.
        const token = localStorage.getItem("token");

        const { data } = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/rides/captain-history`,
          {
            params: {
              status: selectedStatus.toLowerCase(),
              range: selectedRange,
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!cancelled) setRides(data.rides || []);
      } catch (err) {
        console.error(err.response?.data || err.message);
        if (!cancelled) setRides([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchHistory();

    return () => {
      cancelled = true;
    };
  }, [selectedStatus, selectedRange]);

  const visibleRides = useMemo(() => {
    let list = [...rides];

    if (search.trim()) {
      const q = search.trim().toLowerCase();

      list = list.filter((ride) => {
        const riderName = ride.user
          ? `${ride.user.fullname.firstname} ${ride.user.fullname.lastname}`.toLowerCase()
          : "";

        return (
          riderName.includes(q) ||
          ride.pickup?.toLowerCase().includes(q) ||
          ride.destination?.toLowerCase().includes(q)
        );
      });
    }

    switch (sortBy) {
      case "oldest":
        list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case "highestFare":
        list.sort((a, b) => b.fare - a.fare);
        break;
      case "lowestFare":
        list.sort((a, b) => a.fare - b.fare);
        break;
      default:
        list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return list;
  }, [rides, search, sortBy]);

  return (
    <div className="min-h-screen bg-slate-50">
      <RideHistoryHeader
        totalRides={rides.length}
        search={search}
        setSearch={setSearch}
        backTo="/captain-home"
        placeholder="Search rides..."
      />

      <div className="px-5 py-4 space-y-3">
        <RideDateRangeFilter
          selectedRange={selectedRange}
          setSelectedRange={setSelectedRange}
        />

        <RideStatusFilter
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
        />

        <RideSortDropdown sortBy={sortBy} setSortBy={setSortBy} />
      </div>

      <div className="px-5 pb-10 space-y-4">
        {loading && (
          <>
            <RideHistorySkeleton />
            <RideHistorySkeleton />
            <RideHistorySkeleton />
          </>
        )}

        {!loading && visibleRides.length === 0 && (
          <EmptyRideHistory
            icon="ri-file-list-3-line"
            title="No rides yet"
            description="Rides you complete will show up here, with fares, routes, and payment status all in one place."
            ctaLabel="Go online"
            ctaIcon="ri-steering-2-line"
            ctaTo="/captain-home"
          />
        )}

        {!loading &&
          visibleRides.map((ride) => (
            <CaptainRideHistoryCard key={ride._id} ride={ride} />
          ))}
      </div>
    </div>
  );
};

export default CaptainRideHistory;