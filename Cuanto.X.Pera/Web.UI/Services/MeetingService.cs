using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Web.UI.Entities;

namespace Web.UI.Services
{
    public class MeetingService
    {
        public string HistoryKey { get; } = "History";
        public string ActualMeetingKey { get; } = "ActualMeeting";
        
        private List<Meeting> _history;
        public List<Meeting> History { get { return _history; } set { _history = value; NotifyDataChanged(); } }

        private Meeting _actualMeeting;
        public Meeting ActualMeeting { get { return _actualMeeting; } set { _actualMeeting = value; NotifyDataChanged(); } }

        public event Action OnChange;
        private void NotifyDataChanged() => OnChange?.Invoke();
    }
}
