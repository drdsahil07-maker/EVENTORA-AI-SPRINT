import React, { useState } from 'react';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Users,
  IndianRupee,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { Button } from '../common/Button';
import {
  OrganizerEvent,
  EventTypeOption,
  ServiceTypeOption,
} from '../../types';

interface CreateEventFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitEvent: (event: OrganizerEvent) => void;
}

const eventTypeOptions: EventTypeOption[] = [
  'College Fest',
  'Birthday',
  'Wedding',
  'Corporate',
  'Concert',
  'Engagement',
  'Other',
];

const serviceOptions: ServiceTypeOption[] = [
  'DJ',
  'Singer',
  'Photographer',
  'Anchor',
  'Dancer',
  'Makeup Artist',
  'Other',
];

export const CreateEventForm: React.FC<CreateEventFormProps> = ({
  isOpen,
  onClose,
  onSubmitEvent,
}) => {
  const [eventName, setEventName] = useState('');
  const [eventType, setEventType] = useState<EventTypeOption>('Concert');
  const [city, setCity] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [startTime, setStartTime] = useState('18:30');
  const [expectedGuests, setExpectedGuests] = useState<number | ''>('');
  const [totalBudgetINR, setTotalBudgetINR] = useState<number | ''>('');
  const [selectedServices, setSelectedServices] = useState<ServiceTypeOption[]>(['DJ', 'Singer']);
  const [additionalPreferences, setAdditionalPreferences] = useState('');

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  // Post-submission summary state
  const [createdSummary, setCreatedSummary] = useState<OrganizerEvent | null>(null);

  if (!isOpen) return null;

  const toggleService = (service: ServiceTypeOption) => {
    if (selectedServices.includes(service)) {
      setSelectedServices(selectedServices.filter((s) => s !== service));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!eventName.trim()) newErrors.eventName = 'Event name is required';
    if (!city.trim()) newErrors.city = 'City is required';
    if (!eventDate.trim()) newErrors.eventDate = 'Event date is required';
    if (!startTime.trim()) newErrors.startTime = 'Start time is required';
    if (!expectedGuests || Number(expectedGuests) <= 0) {
      newErrors.expectedGuests = 'Enter expected guest count';
    }
    if (!totalBudgetINR || Number(totalBudgetINR) <= 0) {
      newErrors.totalBudgetINR = 'Enter total budget in INR';
    }
    if (selectedServices.length === 0) {
      newErrors.services = 'Select at least one required service';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const newEvent: OrganizerEvent = {
      id: `evt-${Date.now()}`,
      name: eventName.trim(),
      eventType,
      city: city.trim(),
      date: eventDate,
      startTime,
      expectedGuests: Number(expectedGuests),
      totalBudgetINR: Number(totalBudgetINR),
      requiredServices: selectedServices,
      additionalPreferences: additionalPreferences.trim() || undefined,
      status: 'Upcoming',
      allocatedCostINR: 0,
    };

    onSubmitEvent(newEvent);
    setCreatedSummary(newEvent);
  };

  const handleResetAndClose = () => {
    setEventName('');
    setCity('');
    setEventDate('');
    setStartTime('18:30');
    setExpectedGuests('');
    setTotalBudgetINR('');
    setSelectedServices(['DJ', 'Singer']);
    setAdditionalPreferences('');
    setErrors({});
    setCreatedSummary(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={handleResetAndClose}
      />

      <div className="relative bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-[#E2E8F0] overflow-hidden z-10 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
          <div>
            <h3 className="font-bold text-base text-[#0F2747]">
              {createdSummary ? 'Event Created Successfully' : 'Create New Event'}
            </h3>
            <p className="text-xs text-[#64748B]">
              {createdSummary
                ? 'Your event is now active in your organizer workspace'
                : 'Fill in event details to plan talent and budget'}
            </p>
          </div>
          <button
            onClick={handleResetAndClose}
            className="text-[#64748B] hover:text-[#0F172A] p-1.5 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body or Event Summary */}
        <div className="p-6 overflow-y-auto space-y-4">
          {createdSummary ? (
            /* Event Summary Card after successful creation */
            <div className="space-y-4">
              <div className="p-4 bg-[#CCFBF1]/40 border border-[#99F6E4] rounded-2xl text-xs space-y-3">
                <div className="flex items-center gap-2 text-[#0F766E] font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-[#0D9488]" />
                  <span>{createdSummary.name} is ready!</span>
                </div>

                <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-[#99F6E4]/50">
                  <div>
                    <span className="text-[#64748B] block text-[11px]">Event Type:</span>
                    <strong className="text-[#0F172A]">{createdSummary.eventType}</strong>
                  </div>
                  <div>
                    <span className="text-[#64748B] block text-[11px]">City / Location:</span>
                    <strong className="text-[#0F172A]">{createdSummary.city}</strong>
                  </div>
                  <div>
                    <span className="text-[#64748B] block text-[11px]">Date & Time:</span>
                    <strong className="text-[#0F172A]">
                      {createdSummary.date} at {createdSummary.startTime}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[#64748B] block text-[11px]">Expected Guests:</span>
                    <strong className="text-[#0F172A]">
                      {createdSummary.expectedGuests.toLocaleString()} Guests
                    </strong>
                  </div>
                  <div>
                    <span className="text-[#64748B] block text-[11px]">Total Budget:</span>
                    <strong className="text-[#0D9488] text-sm">
                      ₹{createdSummary.totalBudgetINR.toLocaleString('en-IN')}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[#64748B] block text-[11px]">Status:</span>
                    <span className="inline-block px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold text-[10px]">
                      {createdSummary.status}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#99F6E4]/50">
                  <span className="text-[#64748B] block text-[11px] mb-1">Services Needed:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {createdSummary.requiredServices.map((srv) => (
                      <span
                        key={srv}
                        className="px-2 py-0.5 rounded-md bg-white border border-[#99F6E4] text-[#0F766E] font-medium text-[10px]"
                      >
                        {srv}
                      </span>
                    ))}
                  </div>
                </div>

                {createdSummary.additionalPreferences && (
                  <div className="pt-2 border-t border-[#99F6E4]/50">
                    <span className="text-[#64748B] block text-[11px]">Preferences:</span>
                    <p className="text-[11px] text-slate-700 italic">
                      "{createdSummary.additionalPreferences}"
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-2">
                <Button variant="primary" size="md" onClick={handleResetAndClose}>
                  Done & View Dashboard
                </Button>
              </div>
            </div>
          ) : (
            /* Creation Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Event Name */}
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                  Event Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Annual Tech Symposium & Music Night"
                  value={eventName}
                  onChange={(e) => {
                    setEventName(e.target.value);
                    if (errors.eventName) setErrors({ ...errors, eventName: '' });
                  }}
                  className={`w-full text-xs px-3 py-2.5 border rounded-xl outline-none focus:border-[#0D9488] ${
                    errors.eventName ? 'border-rose-300 bg-rose-50/20' : 'border-[#E2E8F0]'
                  }`}
                />
                {errors.eventName && (
                  <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.eventName}
                  </p>
                )}
              </div>

              {/* Event Type */}
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                  Event Type <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
                  {eventTypeOptions.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setEventType(type)}
                      className={`px-2 py-1.5 text-xs font-medium rounded-lg border text-center transition-colors cursor-pointer ${
                        eventType === type
                          ? 'border-[#0D9488] bg-[#CCFBF1]/30 text-[#0F766E] font-semibold'
                          : 'border-[#E2E8F0] hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* City & Event Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                    City <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="w-3.5 h-3.5 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="e.g., Mumbai, Delhi, Bengaluru"
                      value={city}
                      onChange={(e) => {
                        setCity(e.target.value);
                        if (errors.city) setErrors({ ...errors, city: '' });
                      }}
                      className={`w-full text-xs pl-8 pr-3 py-2.5 border rounded-xl outline-none focus:border-[#0D9488] ${
                        errors.city ? 'border-rose-300 bg-rose-50/20' : 'border-[#E2E8F0]'
                      }`}
                    />
                  </div>
                  {errors.city && (
                    <p className="text-[11px] text-rose-500 mt-1">{errors.city}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                    Event Date <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="w-3.5 h-3.5 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="date"
                      value={eventDate}
                      onChange={(e) => {
                        setEventDate(e.target.value);
                        if (errors.eventDate) setErrors({ ...errors, eventDate: '' });
                      }}
                      className={`w-full text-xs pl-8 pr-3 py-2.5 border rounded-xl outline-none focus:border-[#0D9488] ${
                        errors.eventDate ? 'border-rose-300 bg-rose-50/20' : 'border-[#E2E8F0]'
                      }`}
                    />
                  </div>
                  {errors.eventDate && (
                    <p className="text-[11px] text-rose-500 mt-1">{errors.eventDate}</p>
                  )}
                </div>
              </div>

              {/* Start Time & Expected Guests */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                    Start Time <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Clock className="w-3.5 h-3.5 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => {
                        setStartTime(e.target.value);
                        if (errors.startTime) setErrors({ ...errors, startTime: '' });
                      }}
                      className={`w-full text-xs pl-8 pr-3 py-2.5 border rounded-xl outline-none focus:border-[#0D9488] ${
                        errors.startTime ? 'border-rose-300 bg-rose-50/20' : 'border-[#E2E8F0]'
                      }`}
                    />
                  </div>
                  {errors.startTime && (
                    <p className="text-[11px] text-rose-500 mt-1">{errors.startTime}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                    Expected Guests <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Users className="w-3.5 h-3.5 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="number"
                      placeholder="e.g., 500"
                      min={1}
                      value={expectedGuests}
                      onChange={(e) => {
                        setExpectedGuests(e.target.value ? Number(e.target.value) : '');
                        if (errors.expectedGuests) setErrors({ ...errors, expectedGuests: '' });
                      }}
                      className={`w-full text-xs pl-8 pr-3 py-2.5 border rounded-xl outline-none focus:border-[#0D9488] ${
                        errors.expectedGuests ? 'border-rose-300 bg-rose-50/20' : 'border-[#E2E8F0]'
                      }`}
                    />
                  </div>
                  {errors.expectedGuests && (
                    <p className="text-[11px] text-rose-500 mt-1">{errors.expectedGuests}</p>
                  )}
                </div>
              </div>

              {/* Total Budget (INR) */}
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                  Total Budget (INR) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <IndianRupee className="w-3.5 h-3.5 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="number"
                    placeholder="e.g., 150000"
                    min={1000}
                    step={1000}
                    value={totalBudgetINR}
                    onChange={(e) => {
                      setTotalBudgetINR(e.target.value ? Number(e.target.value) : '');
                      if (errors.totalBudgetINR) setErrors({ ...errors, totalBudgetINR: '' });
                    }}
                    className={`w-full text-xs pl-8 pr-3 py-2.5 border rounded-xl outline-none focus:border-[#0D9488] ${
                      errors.totalBudgetINR ? 'border-rose-300 bg-rose-50/20' : 'border-[#E2E8F0]'
                    }`}
                  />
                </div>
                {errors.totalBudgetINR && (
                  <p className="text-[11px] text-rose-500 mt-1">{errors.totalBudgetINR}</p>
                )}
                {totalBudgetINR && (
                  <span className="text-[11px] text-[#0D9488] font-medium block mt-1">
                    Indicative Budget: ₹{Number(totalBudgetINR).toLocaleString('en-IN')}
                  </span>
                )}
              </div>

              {/* Required Services */}
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                  Required Services <span className="text-rose-500">*</span>
                </label>
                <p className="text-[11px] text-[#64748B] mb-2">
                  Select talent and services needed for this event:
                </p>
                <div className="flex flex-wrap gap-2">
                  {serviceOptions.map((service) => {
                    const isSelected = selectedServices.includes(service);
                    return (
                      <button
                        key={service}
                        type="button"
                        onClick={() => {
                          toggleService(service);
                          if (errors.services) setErrors({ ...errors, services: '' });
                        }}
                        className={`px-3 py-1.5 text-xs rounded-xl border transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#0D9488] text-white border-[#0D9488] font-semibold'
                            : 'bg-white text-slate-700 border-[#E2E8F0] hover:border-slate-300'
                        }`}
                      >
                        {isSelected ? `✓ ${service}` : `+ ${service}`}
                      </button>
                    );
                  })}
                </div>
                {errors.services && (
                  <p className="text-[11px] text-rose-500 mt-1">{errors.services}</p>
                )}
              </div>

              {/* Additional Preferences (optional) */}
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                  Additional Preferences (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g., Specific language preference, acoustic setup, outdoor stage rider..."
                  value={additionalPreferences}
                  onChange={(e) => setAdditionalPreferences(e.target.value)}
                  className="w-full text-xs p-3 border border-[#E2E8F0] rounded-xl outline-none focus:border-[#0D9488] resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-[#F1F5F9] flex items-center justify-end gap-2.5">
                <Button
                  variant="ghost"
                  size="sm"
                  type="button"
                  onClick={handleResetAndClose}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  type="submit"
                  icon={<ArrowRight className="w-4 h-4" />}
                  iconPosition="right"
                >
                  Create Event
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
