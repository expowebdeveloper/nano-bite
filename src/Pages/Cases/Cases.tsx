import { useForm } from "react-hook-form";
import { useState, useRef } from "react";
import Input from "../../components/common/Input/Input";
import Button from "../../components/common/Buttons/Button";
import Checkbox from "../../components/common/Checkbox/Checkbox";
import Modal from "../../components/common/Modal/Modal";
import {
  SEX_OPTIONS,
  BRUXISM_OPTIONS,
  SMILE_STYLE_OPTIONS,
  MIDLINE_OPTIONS,
  PHOTO_OPTIONS,
  SCAN_OPTIONS,
  CASE_TYPE_OPTIONS,
  RESTORATION_TYPES,
  MATERIAL_OPTIONS,
  RESTORATION_PREP_OPTIONS,
  CONTACT_OPTIONS,
  OCCLUSION_OPTIONS,
  REQUIRED_SCAN_OPTIONS,
  PONTIC_DESIGN_STD,
  PONTIC_CONTACT_OPTIONS,
  BRIDGE_MATERIAL_OPTIONS,
  BRIDGE_REQUIRED_SCANS,
  IMPLANT_RESTORATION_OPTIONS,
  EMERGENCE_OPTIONS,
  IMPLANT_REQUIRED_SCANS,
  IMPLANT_ABUTMENT_OPTIONS,
  IMPLANT_OCCLUSION_OPTIONS,
  IMPLANT_ALLOWED_OPTIONS,
  FULL_ARCH_DESIGN,
  FULL_ARCH_FRAMEWORK,
  FULL_ARCH_VDO,
  FULL_ARCH_OCCLUSION,
  FULL_ARCH_TOOTH_SIZE,
  FULL_ARCH_GINGIVA,
  FULL_ARCH_MIDLINE,
  FULL_ARCH_REQUIRED_SCANS,
  FULL_ARCH_REQUIRED_SCANS_TOP,
  DIGITAL_DENTURE_TYPE,
  DIGITAL_DENTURE_ARCH,
  DIGITAL_DENTURE_VDO,
  DIGITAL_DENTURE_TOOTH_SETUP,
  DIGITAL_DENTURE_BASE,
  DIGITAL_DENTURE_COPY,
  DIGITAL_DENTURE_REQUIRED_SCANS,
  PARTIAL_TYPES,
  PARTIAL_FRAMEWORK,
  PARTIAL_REQUIRED_SCANS,
  PARTIAL_AESTHETICS,
} from "../../Constants/Constants";

type CaseFormValues = {
  patientName: string;
  age: string;
  sex: string[];
  dueDate: string;
  bruxism: string[];
  smileStyle: string[];
  midline: string[];
  estheticNotes: string;
  photos: string[];
  scans: string[];
  additionalNotes: string;
  caseType: string;
  toothType: string;
  finalShade: string;
  stumpShade: string;
  restorationTypes: string[];
  materialOptions: string[];
  restorationPrep: string[];
  noted: string;
  contacts: string[];
  occlusion: string[];
  requiredScans: string[];
  // Short-span bridge
  abutmentsLeft: string;
  abutmentsRight: string;
  ponticDesign: string[];
  ponticContacts: string[];
  ponticTeeth: string;
  bridgeMaterial: string[];
  bridgeRequiredScans: string[];
  // Implant crown/bridge
  implantBrand: string;
  implantPlatform: string;
  implantConnection: string;
  implantTooth: string;
  implantRestoration: string[];
  implantEmergence: string[];
  implantRequiredScans: string[];
  implantAbutment: string[];
  implantOcclusion: string[];
  implantAllowed: string[];
  fullArchDesign: string[];
  fullArchFramework: string[];
  fullArchVdo: string[];
  fullArchOcc: string[];
  fullArchToothSize: string[];
  fullArchGingiva: string[];
  fullArchMidline: string[];
  fullArchRequiredScansTop: string[];
  fullArchRequiredScans: string[];
  digitalType: string[];
  digitalArch: string[];
  digitalVdo: string[];
  digitalToothSetup: string[];
  digitalShade: string;
  digitalBase: string[];
  digitalCopy: string[];
  digitalRequiredScans: string[];
  digitalNewRecord: string;
  digitalChanges: string;
  // Partial denture
  partialType: string[];
  partialFramework: string[];
  partialMajorConnector: string;
  partialRests: string;
  partialShade: string;
  partialClasps: string;
  partialBaseAreas: string;
  partialAesthetics: string[];
  partialRequiredScans: string[];
};

const Cases = () => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const formConfig = useForm<CaseFormValues>({
    defaultValues: {
      patientName: "",
      age: "",
      sex: [],
      dueDate: "",
      bruxism: [],
      smileStyle: [],
      midline: [],
      estheticNotes: "",
      photos: [],
      scans: [],
      additionalNotes: "",
      caseType: "",
      toothType: "",
      finalShade: "",
      stumpShade: "",
      restorationTypes: [],
      materialOptions: [],
      restorationPrep: [],
      noted: "",
      contacts: [],
      occlusion: [],
      requiredScans: [],
      abutmentsLeft: "",
      abutmentsRight: "",
      ponticDesign: [],
      ponticContacts: [],
      ponticTeeth: "",
      bridgeMaterial: [],
      bridgeRequiredScans: [],
      implantBrand: "",
      implantPlatform: "",
      implantConnection: "",
      implantTooth: "",
      implantRestoration: [],
      implantEmergence: [],
      implantRequiredScans: [],
      implantAbutment: [],
      implantOcclusion: [],
      implantAllowed: [],
      fullArchDesign: [],
      fullArchFramework: [],
      fullArchVdo: [],
      fullArchOcc: [],
      fullArchToothSize: [],
      fullArchGingiva: [],
      fullArchMidline: [],
      fullArchRequiredScansTop: [],
      fullArchRequiredScans: [],
      digitalType: [],
      digitalArch: [],
      digitalVdo: [],
      digitalToothSetup: [],
      digitalShade: "",
      digitalBase: [],
      digitalCopy: [],
      digitalRequiredScans: [],
      digitalNewRecord: "",
      digitalChanges: "",
      partialType: [],
      partialFramework: [],
      partialMajorConnector: "",
      partialRests: "",
      partialShade: "",
      partialClasps: "",
      partialBaseAreas: "",
      partialAesthetics: [],
      partialRequiredScans: [],
    },
  });

  const { handleSubmit, register } = formConfig;

  const onSubmit = (values: CaseFormValues) => {
    console.log("Case form submit", values);
  };

  return (
    <div className="min-h-screen bg-[#fbfeff] p-6">
                <h2 className="text-2xl font-bold text-gray-900 p-2">Patient Information:</h2>

      <div className="mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-8">

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Patient Name"
                fieldName="patientName"
                formConfig={formConfig}
                placeholder="Name"
              />
              <Input
                label="Age"
                fieldName="age"
                formConfig={formConfig}
                placeholder="Age"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-800">Sex</p>
                <div className="flex items-center gap-4 text-sm text-gray-700">
                  {SEX_OPTIONS.map((opt) => (
                    <Checkbox
                      key={opt}
                      label={opt}
                      value={opt}
                      fieldName="sex"
                      formConfig={formConfig}
                    />
                  ))}
                </div>
              </div>
              <div>
                <Input
                  label="Due Date"
                  fieldName="dueDate"
                  formConfig={formConfig}
                  placeholder="Due Date"
                  type="date"
                />
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-800 mb-2">Bruxism</p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                {BRUXISM_OPTIONS.map((opt) => (
                  <Checkbox
                    key={opt}
                    label={opt}
                    value={opt}
                    fieldName="bruxism"
                    formConfig={formConfig}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-base font-semibold text-gray-900">Esthetic Notes (If Applicable):</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-800">Smile Style</p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                    {SMILE_STYLE_OPTIONS.map((opt) => (
                      <Checkbox
                        key={opt}
                        label={opt}
                        value={opt}
                        fieldName="smileStyle"
                        formConfig={formConfig}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">Midline</p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                    {MIDLINE_OPTIONS.map((opt) => (
                      <Checkbox
                        key={opt}
                        label={opt}
                        value={opt}
                        fieldName="midline"
                        formConfig={formConfig}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">Additional Esthetic Notes:</p>
                <textarea
                  {...register("estheticNotes")}
                  placeholder="-"
                  className="w-full min-h-[120px] rounded-2xl bg-[#f7f9fb] border border-[#e5edf5] px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0B75C9]/30"
                />
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-base font-semibold text-gray-900">Photos:</h2>
              <div>
                <p className="text-sm font-semibold text-gray-800">Check All Provided</p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                  {PHOTO_OPTIONS.map((opt) => (
                    <Checkbox
                      key={opt}
                      label={opt}
                      value={opt}
                      fieldName="photos"
                      formConfig={formConfig}
                    />
                  ))}
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  btnType="button"
                  btnText="Upload Link or Cloud Folder"
                  customClass="!py-2 !px-4 rounded-lg bg-transparent text-[#0B75C9] border border-[#0B75C9] hover:bg-[#0B75C9] hover:text-white"
                  backGround={false}
                  border={false}
                  btnClick={() => setShowUploadModal(true)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-900">Scans Provided</p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                {SCAN_OPTIONS.map((opt) => (
                  <Checkbox
                    key={opt}
                    label={opt}
                    value={opt}
                    fieldName="scans"
                    formConfig={formConfig}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-900">Additional Notes:</p>
              <textarea
                {...register("additionalNotes")}
                placeholder="-"
                className="w-full min-h-[140px] rounded-2xl bg-[#f7f9fb] border border-[#e5edf5] px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0B75C9]/30"
              />
            </div>

            <div className="flex justify-between items-center border-t border-dashed border-gray-200 pt-4">
              <Button
                btnType="submit"
                btnText="Submit"
                customClass="!h-11 !px-6 rounded-xl bg-gradient-to-r from-[#0B75C9] to-[#3BA6E5] text-white border-none"
                backGround={false}
                border={false}
              />
              <div className="flex items-center gap-10 text-xs text-gray-500">
                <div className="flex flex-col items-center">
                  <div className="w-28 border-b border-gray-300 mb-1" />
                  <span>Doctor Signature</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 border-b border-gray-300 mb-1" />
                  <span>Date</span>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Short-span Bridge */}
      <div className="mt-6 mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Short-span Bridge</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Abutments"
              fieldName="abutmentsLeft"
              formConfig={formConfig}
              placeholder="Abutments"
            />
            <Input
              label="Pontic Teeth"
              fieldName="ponticTeeth"
              formConfig={formConfig}
              placeholder="Pontic Teeth"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div className="space-y-3">
              <p className="text-sm font-semibold text-gray-800">Pontic Design</p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                {PONTIC_DESIGN_STD.map((opt) => (
                  <Checkbox
                    key={opt}
                    label={opt}
                    value={opt}
                    fieldName="ponticDesign"
                    formConfig={formConfig}
                  />
                ))}
              </div>
              <p className="text-sm font-semibold text-gray-800">Pontic Design</p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                {PONTIC_CONTACT_OPTIONS.map((opt) => (
                  <Checkbox
                    key={opt}
                    label={opt}
                    value={opt}
                    fieldName="ponticContacts"
                    formConfig={formConfig}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-semibold text-gray-800">Material</p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                {BRIDGE_MATERIAL_OPTIONS.map((opt) => (
                  <Checkbox
                    key={opt}
                    label={opt}
                    value={opt}
                    fieldName="bridgeMaterial"
                    formConfig={formConfig}
                  />
                ))}
              </div>
              <p className="text-sm font-semibold text-gray-800">Required Scans</p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                {BRIDGE_REQUIRED_SCANS.map((opt) => (
                  <Checkbox
                    key={opt}
                    label={opt}
                    value={opt}
                    fieldName="bridgeRequiredScans"
                    formConfig={formConfig}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Implant Crown / Implant Bridge */}
      <div className="mt-6 mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Implant Crown / Implant Bridge</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Brand"
              fieldName="implantBrand"
              formConfig={formConfig}
              placeholder="Brand"
            />
            <Input
              label="Connection"
              fieldName="implantConnection"
              formConfig={formConfig}
              placeholder="Connection"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-800">Platform</label>
              <select
                {...register("implantPlatform")}
                className="w-full h-11 rounded-md border border-[#d9e8f5] bg-white px-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0B75C9]/30"
                defaultValue=""
              >
                <option value="" disabled>
                  Select
                </option>
                <option value="10mm">10mm</option>
                <option value="11mm">11mm</option>
                <option value="12mm">12mm</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-800">Tooth</label>
              <select
                {...register("implantTooth")}
                className="w-full h-11 rounded-md border border-[#d9e8f5] bg-white px-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0B75C9]/30"
                defaultValue=""
              >
                <option value="" disabled>
                  Select
                </option>
                <option value="Anterior">Anterior</option>
                <option value="Posterior">Posterior</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-800">Restoration</p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                {IMPLANT_RESTORATION_OPTIONS.map((opt) => (
                  <Checkbox
                    key={opt}
                    label={opt}
                    value={opt}
                    fieldName="implantRestoration"
                    formConfig={formConfig}
                  />
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-800">Abutment</p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                {IMPLANT_ABUTMENT_OPTIONS.map((opt) => (
                  <Checkbox
                    key={opt}
                    label={opt}
                    value={opt}
                    fieldName="implantAbutment"
                    formConfig={formConfig}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-800">Emergence</p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                {EMERGENCE_OPTIONS.map((opt) => (
                  <Checkbox
                    key={opt}
                    label={opt}
                    value={opt}
                    fieldName="implantEmergence"
                    formConfig={formConfig}
                  />
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-800">Occlusion</p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                {IMPLANT_OCCLUSION_OPTIONS.map((opt) => (
                  <Checkbox
                    key={opt}
                    label={opt}
                    value={opt}
                    fieldName="implantOcclusion"
                    formConfig={formConfig}
                  />
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-800">Allowed</p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                {IMPLANT_ALLOWED_OPTIONS.map((opt) => (
                  <Checkbox
                    key={opt}
                    label={opt}
                    value={opt}
                    fieldName="implantAllowed"
                    formConfig={formConfig}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-800">Required Scans</p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-700">
              {IMPLANT_REQUIRED_SCANS.map((opt) => (
                <Checkbox
                  key={opt}
                  label={opt}
                  value={opt}
                  fieldName="implantRequiredScans"
                  formConfig={formConfig}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Full Arch Implant Fixed */}
      <div className="mt-6 mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Full Arch Implant Fixed</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-800">Required Scans</p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                {FULL_ARCH_REQUIRED_SCANS_TOP.map((opt) => (
                  <Checkbox
                    key={opt}
                    label={opt}
                    value={opt}
                    fieldName="fullArchRequiredScansTop"
                    formConfig={formConfig}
                  />
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-800">Design</p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                {FULL_ARCH_DESIGN.map((opt) => (
                  <Checkbox
                    key={opt}
                    label={opt}
                    value={opt}
                    fieldName="fullArchDesign"
                    formConfig={formConfig}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-800">VDO</p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                {FULL_ARCH_VDO.map((opt) => (
                  <Checkbox
                    key={opt}
                    label={opt}
                    value={opt}
                    fieldName="fullArchVdo"
                    formConfig={formConfig}
                  />
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-800">Occlusion</p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                {FULL_ARCH_OCCLUSION.map((opt) => (
                  <Checkbox
                    key={opt}
                    label={opt}
                    value={opt}
                    fieldName="fullArchOcc"
                    formConfig={formConfig}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-800">Framework</p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                {FULL_ARCH_FRAMEWORK.map((opt) => (
                  <Checkbox
                    key={opt}
                    label={opt}
                    value={opt}
                    fieldName="fullArchFramework"
                    formConfig={formConfig}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-800">Required Scans</p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-700">
              {FULL_ARCH_REQUIRED_SCANS.map((opt) => (
                <Checkbox
                  key={opt}
                  label={opt}
                  value={opt}
                  fieldName="fullArchRequiredScans"
                  formConfig={formConfig}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-800">Esthetics - Tooth Size</p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                {FULL_ARCH_TOOTH_SIZE.map((opt) => (
                  <Checkbox
                    key={opt}
                    label={opt}
                    value={opt}
                    fieldName="fullArchToothSize"
                    formConfig={formConfig}
                  />
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-800">Esthetics - Gingiva</p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                {FULL_ARCH_GINGIVA.map((opt) => (
                  <Checkbox
                    key={opt}
                    label={opt}
                    value={opt}
                    fieldName="fullArchGingiva"
                    formConfig={formConfig}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-800">Midline</p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-700">
              {FULL_ARCH_MIDLINE.map((opt) => (
                <Checkbox
                  key={opt}
                  label={opt}
                  value={opt}
                  fieldName="fullArchMidline"
                  formConfig={formConfig}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Digital Complete Denture */}
      <div className="mt-6 mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Digital Complete Denture</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-800">Type</p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                {DIGITAL_DENTURE_TYPE.map((opt) => (
                  <Checkbox
                    key={opt}
                    label={opt}
                    value={opt}
                    fieldName="digitalType"
                    formConfig={formConfig}
                  />
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-800">Arch</p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                {DIGITAL_DENTURE_ARCH.map((opt) => (
                  <Checkbox
                    key={opt}
                    label={opt}
                    value={opt}
                    fieldName="digitalArch"
                    formConfig={formConfig}
                  />
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-800">VDO</p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                {DIGITAL_DENTURE_VDO.map((opt) => (
                  <Checkbox
                    key={opt}
                    label={opt}
                    value={opt}
                    fieldName="digitalVdo"
                    formConfig={formConfig}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-800">New Record</p>
              <Input
                fieldName="digitalNewRecord"
                formConfig={formConfig}
                placeholder="10mm"
              />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-800">Tooth Setup</p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                {DIGITAL_DENTURE_TOOTH_SETUP.map((opt) => (
                  <Checkbox
                    key={opt}
                    label={opt}
                    value={opt}
                    fieldName="digitalToothSetup"
                    formConfig={formConfig}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-800">Shade</p>
              <Input fieldName="digitalShade" formConfig={formConfig} placeholder="Shade" />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-800">Base</p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                {DIGITAL_DENTURE_BASE.map((opt) => (
                  <Checkbox
                    key={opt}
                    label={opt}
                    value={opt}
                    fieldName="digitalBase"
                    formConfig={formConfig}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-800">Copy Denture</p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                {DIGITAL_DENTURE_COPY.map((opt) => (
                  <Checkbox
                    key={opt}
                    label={opt}
                    value={opt}
                    fieldName="digitalCopy"
                    formConfig={formConfig}
                  />
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-800">Changes</p>
              <textarea
                {...register("digitalChanges")}
                placeholder="Changes"
                className="w-full min-h-[60px] rounded-md bg-[#f7f9fb] border border-[#e5edf5] px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0B75C9]/30"
              />
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-800">Required Scans</p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-700">
              {DIGITAL_DENTURE_REQUIRED_SCANS.map((opt) => (
                <Checkbox
                  key={opt}
                  label={opt}
                  value={opt}
                  fieldName="digitalRequiredScans"
                  formConfig={formConfig}
                />
              ))}
            </div>
          </div>

          {/* Partial Denture */}
          <h2 className="text-xl font-semibold text-gray-900 pt-6">Partial Denture</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-800">Type</p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                {PARTIAL_TYPES.map((opt) => (
                  <Checkbox
                    key={opt}
                    label={opt}
                    value={opt}
                    fieldName="partialType"
                    formConfig={formConfig}
                  />
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-800">Framework</p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                {PARTIAL_FRAMEWORK.map((opt) => (
                  <Checkbox
                    key={opt}
                    label={opt}
                    value={opt}
                    fieldName="partialFramework"
                    formConfig={formConfig}
                  />
                ))}
              </div>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-gray-900">Design</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Major Connector"
              fieldName="partialMajorConnector"
              formConfig={formConfig}
              placeholder="Major Connector"
            />
            <Input
              label="Clasps (Tooth/Type)"
              fieldName="partialClasps"
              formConfig={formConfig}
              placeholder="Clasps (Tooth/Type)"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Rests"
              fieldName="partialRests"
              formConfig={formConfig}
              placeholder="Rests"
            />
            <Input
              label="Base Areas"
              fieldName="partialBaseAreas"
              formConfig={formConfig}
              placeholder="Base Areas"
            />
          </div>

          <Input
            label="Shade"
            fieldName="partialShade"
            formConfig={formConfig}
            placeholder="Shade"
          />

          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-800">Required Scans</p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-700">
              {PARTIAL_REQUIRED_SCANS.map((opt) => (
                <Checkbox
                  key={opt}
                  label={opt}
                  value={opt}
                  fieldName="partialRequiredScans"
                  formConfig={formConfig}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-800">Aesthetics</p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-700">
              {PARTIAL_AESTHETICS.map((opt) => (
                <Checkbox
                  key={opt}
                  label={opt}
                  value={opt}
                  fieldName="partialAesthetics"
                  formConfig={formConfig}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Case Type Step */}
      {/* Case Type Step - Single Crown / Onlay / Veneer */}
      <div className="mt-6 mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-800">Case Type</label>
            <select
              {...register("caseType")}
              className="w-full h-11 rounded-md border border-[#0b75c9] bg-[#0b75c9] text-white px-3 text-sm focus:outline-none"
              defaultValue=""
            >
              <option value="" disabled className="text-gray-200">
                Case Type
              </option>
              {CASE_TYPE_OPTIONS.map((opt) => (
                <option key={opt} value={opt} className="text-gray-900">
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <h2 className="text-2xl font-semibold text-gray-900">Single Crown / Onlay / Veneer</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-800">Tooth & Type</label>
              <Input
                fieldName="toothType"
                formConfig={formConfig}
                placeholder="Tooth & Type"
              />
            </div>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-6 text-sm text-gray-800">
                <div className="flex items-center gap-3">
                  <span className="font-semibold">Restoration</span>
                  {RESTORATION_TYPES.map((opt) => (
                    <Checkbox
                      key={opt}
                      label={opt}
                      value={opt}
                      fieldName="restorationTypes"
                      formConfig={formConfig}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold">Material</span>
                  {MATERIAL_OPTIONS.map((opt) => (
                    <Checkbox
                      key={opt}
                      label={opt}
                      value={opt}
                      fieldName="materialOptions"
                      formConfig={formConfig}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-gray-900">Shade</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Final Shade"
              fieldName="finalShade"
              formConfig={formConfig}
              placeholder="Final Shade"
            />
            <Input
              label="Stump Shade"
              fieldName="stumpShade"
              formConfig={formConfig}
              placeholder="Stump Shade"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-800">Restoration</p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                {RESTORATION_PREP_OPTIONS.map((opt) => (
                  <Checkbox
                    key={opt}
                    label={opt}
                    value={opt}
                    fieldName="restorationPrep"
                    formConfig={formConfig}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-800">Noted:</p>
            <textarea
              {...register("noted")}
              placeholder="Noted"
              className="w-full min-h-[80px] rounded-md bg-[#f7f9fb] border border-[#e5edf5] px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0B75C9]/30"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-800">Contacts</p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                {CONTACT_OPTIONS.map((opt) => (
                  <Checkbox
                    key={opt}
                    label={opt}
                    value={opt}
                    fieldName="contacts"
                    formConfig={formConfig}
                  />
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-800">Occlusion</p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                {OCCLUSION_OPTIONS.map((opt) => (
                  <Checkbox
                    key={opt}
                    label={opt}
                    value={opt}
                    fieldName="occlusion"
                    formConfig={formConfig}
                  />
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-800">Required Scans</p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                {REQUIRED_SCAN_OPTIONS.map((opt) => (
                  <Checkbox
                    key={opt}
                    label={opt}
                    value={opt}
                    fieldName="requiredScans"
                    formConfig={formConfig}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>


      <Modal
        open={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        widthClass="max-w-md"
        showHeader={false}
      >
        <div className="mx-auto text-center space-y-6">
          <div className="border-2 border-dashed border-[#d6dde6] rounded-2xl p-8 bg-white flex flex-col items-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Upload Link or Cloud Folder
            </h3>
            <p className="text-sm text-gray-600 mb-2">File Supported: JPG, PNG, GIF</p>
            <p className="text-sm text-gray-700 font-semibold mb-4">Or</p>
            <div className="flex justify-center">
              <Button
                btnType="button"
                btnText="Browse Files"
                customClass="!py-3 !px-6 rounded-lg bg-transparent text-[#0B75C9] border border-[#0B75C9] hover:bg-[#0B75C9] hover:text-white"
                backGround={false}
                border={false}
                btnClick={() => fileInputRef.current?.click()}
              />
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".jpg,.jpeg,.png,.gif"
              />
            </div>
            <p className="text-xs text-gray-500 mt-4">Maximum Size: 10 mb</p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Cases;

