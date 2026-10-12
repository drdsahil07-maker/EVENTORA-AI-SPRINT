import React from 'react';
import { DateRescueModal } from '../rescue/DateRescueModal';
import { OrganizerEvent, OrganizerBookingRequest, RescueRequestData } from '../../types';

interface BackupRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (request: {
    eventTitle: string;
    roleNeeded: string;
    urgency: string;
    timeLimit: string;
    location: string;
    budget: string;
  }) => void;
  existingEvents?: OrganizerEvent[];
  initialPrefill?: Partial<RescueRequestData>;
  onBookingCreated?: (booking: OrganizerBookingRequest) => void;
  onViewMyBookings?: () => void;
}

export const BackupRequestModal: React.FC<BackupRequestModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  existingEvents,
  initialPrefill,
  onBookingCreated,
  onViewMyBookings,
}) => {
  return (
    <DateRescueModal
      isOpen={isOpen}
      onClose={onClose}
      existingEvents={existingEvents}
      initialPrefill={initialPrefill}
      onBookingCreated={(booking) => {
        if (onBookingCreated) {
          onBookingCreated(booking);
        }
        if (onSubmit) {
          onSubmit({
            eventTitle: booking.eventName,
            roleNeeded: booking.targetName,
            urgency: 'Date Rescue',
            timeLimit: booking.date,
            location: 'Rescue Location',
            budget: `₹${booking.estimatedCostINR.toLocaleString('en-IN')}`,
          });
        }
      }}
      onViewMyBookings={onViewMyBookings}
    />
  );
};
