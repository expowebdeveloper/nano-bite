import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CaseDueDates = () => {
    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const dates = [
        { day: '', date: '' }, { day: '', date: '' }, { day: '', date: '' }, { day: '', date: '' }, { day: '', date: '' }, { day: '1', date: '1' }, { day: '2', date: '2' }, { day: '3', date: '3' },
        { day: '4', date: '4' }, { day: '5', date: '5' }, { day: '6', date: '6' }, { day: '7', date: '7' }, { day: '8', date: '8' }, { day: '9', date: '9' }, { day: '10', date: '10' },
        { day: '11', date: '11' }, { day: '12', date: '12' }, { day: '13', date: '13' }, { day: '14', date: '14', active: true }, { day: '15', date: '15' }, { day: '16', date: '16' }, { day: '17', date: '17' },
        { day: '18', date: '18' }, { day: '19', date: '19' }, { day: '20', date: '20' }, { day: '21', date: '21' }, { day: '22', date: '22' }, { day: '23', date: '23' }, { day: '24', date: '24' },
        { day: '25', date: '25' }, { day: '26', date: '26' }, { day: '27', date: '27' }, { day: '28', date: '28' }, { day: '29', date: '29' }, { day: '30', date: '30' }, { day: '31', date: '31' },
    ];

    return (
        <div className="bg-white rounded-xl p-6 shadow-sm h-full">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-900">Case Due Dates</h2>
                <div className="relative">
                    <select className="appearance-none bg-white border border-gray-200 text-gray-700 py-1 px-3 pr-8 rounded-lg text-sm focus:outline-none focus:border-blue-500">
                        <option>December 2025</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium text-gray-600">December 2025</span>
                <div className="flex gap-2">
                    <button className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600">
                        <ChevronLeft size={16} />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600">
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
                {days.map((day) => (
                    <div key={day} className="text-center text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
                {dates.map((date, index) => (
                    <div key={index} className="aspect-square flex items-center justify-center">
                        {date.date && (
                            <button
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-colors
                        ${date.active
                                        ? 'bg-[#2B89D2] text-white shadow-md shadow-blue-200'
                                        : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                {date.date}
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CaseDueDates;
