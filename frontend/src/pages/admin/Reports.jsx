import { useQuery } from '@tanstack/react-query';
import DashboardLayout from '../../layouts/DashboardLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import { adminAPI } from '../../services';

export default function Reports() {
  const { data: daily, isLoading: loadingDaily } = useQuery({
    queryKey: ['daily-report'],
    queryFn: () => adminAPI.getDailyReport().then((r) => r.data.data),
  });

  const { data: weekly, isLoading: loadingWeekly } = useQuery({
    queryKey: ['weekly-report'],
    queryFn: () => adminAPI.getWeeklyReport().then((r) => r.data.data),
  });

  const downloadPdf = async () => {
    const { data } = await adminAPI.downloadPdf();
    const url = window.URL.createObjectURL(new Blob([data]));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sqms-report.pdf';
    a.click();
  };

  const downloadExcel = async () => {
    const { data } = await adminAPI.downloadExcel();
    const url = window.URL.createObjectURL(new Blob([data]));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sqms-report.xlsx';
    a.click();
  };

  if (loadingDaily || loadingWeekly) return <DashboardLayout role="ADMIN"><LoadingSpinner /></DashboardLayout>;

  return (
    <DashboardLayout role="ADMIN">
      <div className="flex gap-4 mb-6">
        <button onClick={downloadPdf} className="bg-danger text-white px-6 py-3 rounded-xl font-semibold">
          Export PDF
        </button>
        <button onClick={downloadExcel} className="bg-success text-white px-6 py-3 rounded-xl font-semibold">
          Export Excel
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-lg mb-4">Daily Report</h3>
          <div className="space-y-3">
            {Object.entries(daily || {}).map(([key, value]) => (
              <div key={key} className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                <span className="font-semibold">{String(value)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-lg mb-4">Weekly Report</h3>
          <div className="space-y-3">
            {Object.entries(weekly || {}).map(([key, value]) => (
              <div key={key} className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                <span className="font-semibold">{String(value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
