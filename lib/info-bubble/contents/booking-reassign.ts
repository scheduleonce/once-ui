export class BookingReassignmentToolTips {
  static bookingReassignToolTip = `<div class="tooltipgHeaderStandard"></div>
       <div class="bookingReassignmentTooltip">
       <div class="bookingReassigmentCircle green"></div>
        <p><span>Available:</span> A Booking page that is available at the meeting time according to the Booking page’s availability.</p>
        <div class="bookingReassigmentCircle orange"></div>
        <p><span>Not available:</span>
          A Booking page that is not available at the meeting time according to the Booking page’s
          availability settings.</p>
       <div class="bookingReassigmentCircle purple"></div>
         <p><span>Busy:</span> A Booking page that has a scheduled booking at the meeting time.</p>
        <div class="bookingReassigmentCircle red"></div>
         <p><span>Issue:</span>
           A Booking page that has one of the following issues: The page is disabled, location or
           3rd party integrations are not the same as the original booking and 3rd party
           integration connection errors.</p>
        </div>`;
}
