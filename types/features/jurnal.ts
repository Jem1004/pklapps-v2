// Jurnal Types
export interface Jurnal {
  id: string;
  tanggal: Date;
  kegiatan: string;
  keterangan?: string;
  studentId: string;
  createdAt: Date;
  updatedAt: Date;
  student?: {
    id: string;
    username: string;
    name?: string;
  };
}

export interface JurnalCreateInput {
  tanggal: Date;
  kegiatan: string;
  keterangan?: string;
  studentId: string;
}

export interface JurnalUpdateInput {
  tanggal?: Date;
  kegiatan?: string;
  keterangan?: string;
}

export interface JurnalFilter {
  studentId?: string;
  startDate?: Date;
  endDate?: Date;
  search?: string;
}

export interface JurnalResponse {
  success: boolean;
  message?: string;
  data?: Jurnal | Jurnal[];
  total?: number;
}