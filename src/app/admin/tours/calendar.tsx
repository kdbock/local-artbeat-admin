"use client";

import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Tour } from "./TourForm";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export default function ToursCalendarPage() {
  type CalendarEvent = {
    id: string;
    title: string;
    start: string;
    end: string;
    extendedProps: Tour;
  };
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchTours() {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/tours`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setEvents(
          (data.tours || []).map((tour: Tour) => ({
            id: String(tour.id),
            title: tour.title,
            start: tour.startDateTime,
            end: tour.endDateTime,
            extendedProps: tour,
          }))
        );
      } catch {
        setError("Failed to load tours");
      }
      setLoading(false);
    }
    fetchTours();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Tours & Events Calendar</h1>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          eventClick={(info) => {
            const tour = info.event.extendedProps as Tour;
            alert(`Tour: ${tour.title}\n${tour.startDateTime} - ${tour.endDateTime}`);
          }}
          height="auto"
        />
      )}
    </div>
  );
}
