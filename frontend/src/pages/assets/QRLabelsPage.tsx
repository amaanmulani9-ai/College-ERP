import React, { useState } from "react";
import {
  PageContainer,
  PageHeader,
  Button,
} from "../../design-system";
import { QrCode, Printer, Download, Search } from "lucide-react";

export const QRLabelsPage: React.FC = () => {
  const [assetCode, setAssetCode] = useState("AST-CS-001");
  const [selectedAsset, setSelectedAsset] = useState({
    asset_code: "AST-CS-001",
    asset_name: "Dell PowerEdge Server R750",
    category_name: "Computers & IT Hardware",
    department_name: "Computer Science",
    location: "Server Room Block A",
    serial_number: "SN-998822-CS",
    barcode: "BAR-AST-CS-001",
    purchase_date: "2024-03-15",
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <PageContainer>
      <PageHeader
        title="Asset QR Code & Barcode Label Generator"
        subtitle="Generate, preview and print institutional asset QR tags and barcode stickers"
        actions={
          <Button variant="primary" leftIcon={<Printer className="w-4 h-4" />} onClick={handlePrint}>
            Print Printable Tag
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Search & Details */}
        <div className="md:col-span-1 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Search className="w-4 h-4 text-indigo-400" /> Search Asset Tag
          </h3>
          <div>
            <label className="text-xs text-slate-400 font-semibold block mb-1">Enter Asset Code</label>
            <input
              type="text"
              value={assetCode}
              onChange={(e) => setAssetCode(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500"
              placeholder="e.g. AST-CS-001"
            />
          </div>

          <div className="pt-4 border-t border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between text-slate-400"><span>Asset Name:</span> <span className="text-slate-100 font-medium">{selectedAsset.asset_name}</span></div>
            <div className="flex justify-between text-slate-400"><span>Category:</span> <span className="text-slate-100 font-medium">{selectedAsset.category_name}</span></div>
            <div className="flex justify-between text-slate-400"><span>Department:</span> <span className="text-slate-100 font-medium">{selectedAsset.department_name}</span></div>
            <div className="flex justify-between text-slate-400"><span>Location:</span> <span className="text-slate-100 font-medium">{selectedAsset.location}</span></div>
            <div className="flex justify-between text-slate-400"><span>Serial No:</span> <span className="text-slate-100 font-medium">{selectedAsset.serial_number}</span></div>
          </div>
        </div>

        {/* Right Label Preview */}
        <div className="md:col-span-2 p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center space-y-6">
          <h3 className="text-base font-bold text-white">Printable Tag Preview</h3>

          {/* Tag Card */}
          <div className="w-80 p-6 rounded-2xl bg-white text-slate-950 shadow-2xl border-4 border-slate-900 flex flex-col items-center text-center space-y-3 font-mono">
            <div className="text-xs font-black tracking-widest text-indigo-900 uppercase">COLLEGE ERP ASSET TAG</div>
            <div className="w-32 h-32 bg-slate-100 rounded-xl p-2 border border-slate-300 flex items-center justify-center">
              <QrCode className="w-24 h-24 text-slate-900" />
            </div>
            <div className="text-sm font-extrabold tracking-tight text-slate-900">{selectedAsset.asset_code}</div>
            <div className="text-[11px] font-bold text-slate-700 leading-tight">{selectedAsset.asset_name}</div>
            <div className="text-[10px] text-slate-500">{selectedAsset.department_name} | {selectedAsset.location}</div>
            <div className="w-full pt-2 border-t border-slate-300 text-[9px] text-slate-400">
              {selectedAsset.barcode}
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="secondary" leftIcon={<Download className="w-4 h-4" />}>
              Download SVG Tag
            </Button>
            <Button variant="primary" leftIcon={<Printer className="w-4 h-4" />} onClick={handlePrint}>
              Batch Print Labels
            </Button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
