'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useMemo } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { absensiFilterSchema, jurnalFilterSchema, activityFilterSchema, reportFilterSchema } from '@/lib/validations';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

// Generic type for filter data
type FilterType = 'jurnal' | 'absensi' | 'activity' | 'report';

// Map filter types to their schemas
const filterSchemas = {
  jurnal: jurnalFilterSchema,
  absensi: absensiFilterSchema,
  activity: activityFilterSchema,
  report: reportFilterSchema,
};

type FilterSchema<T extends FilterType> = z.infer<typeof filterSchemas[T]>;

interface FilterFormProps<T extends FilterType> {
  type: T;
  defaultValues?: Partial<FilterSchema<T>>;
  onFilter: (data: FilterSchema<T>) => void;
  isLoading: boolean;
}

export function FilterForm<T extends FilterType>({ type, defaultValues, onFilter, isLoading }: FilterFormProps<T>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const schema = useMemo(() => filterSchemas[type], [type]);

  const form = useForm<FilterSchema<T>>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as any,
  });

  // Populate form from URL search params
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    const values = Object.fromEntries(params.entries());
    form.reset(values as any);
  }, [searchParams, form]);

  const onSubmit = (data: FilterSchema<T>) => {
    const params = new URLSearchParams();
    Object.entries(data).forEach(([key, value]) => {
      if (value) {
        params.set(key, String(value));
      }
    });
    router.push(`?${params.toString()}`);
    onFilter(data);
  };

  const handleReset = () => {
    form.reset(defaultValues || {});
    router.push('?');
    onFilter({} as FilterSchema<T>);
  };

  const activeFilters = useMemo(() => {
    return Object.entries(form.watch()).filter(([, value]) => value);
  }, [form]);

  const renderField = (fieldName: keyof FilterSchema<T>) => {
    switch (fieldName) {
      case 'startDate':
      case 'endDate':
        return (
          <div key={String(fieldName)} className="grid gap-2">
            <Label htmlFor={String(fieldName)}>{fieldName === 'startDate' ? 'Tanggal Mulai' : 'Tanggal Akhir'}</Label>
            <Input id={String(fieldName)} type="date" {...form.register(fieldName as any)} />
          </div>
        );
      case 'studentId':
        return (
          <div key={String(fieldName)} className="grid gap-2">
            <Label htmlFor="studentId">Student ID</Label>
            <Input id="studentId" placeholder="ID Siswa" {...form.register('studentId' as any)} />
          </div>
        );
      case 'tempatPklId':
        return (
          <div key={String(fieldName)} className="grid gap-2">
            <Label htmlFor="tempatPklId">Tempat PKL ID</Label>
            <Input id="tempatPklId" placeholder="ID Tempat PKL" {...form.register('tempatPklId' as any)} />
          </div>
        );
      case 'search':
        return (
          <div key={String(fieldName)} className="grid gap-2">
            <Label htmlFor="search">Pencarian</Label>
            <Input id="search" placeholder="Cari..." {...form.register('search' as any)} />
          </div>
        );
      case 'userId':
        return (
          <div key={String(fieldName)} className="grid gap-2">
            <Label htmlFor="userId">User ID</Label>
            <Input id="userId" placeholder="ID User" {...form.register('userId' as any)} />
          </div>
        );
      case 'role':
        return (
          <div key={String(fieldName)} className="grid gap-2">
            <Label htmlFor="role">Role</Label>
            <Select onValueChange={(value) => form.setValue('role' as any, value as any)} defaultValue={form.getValues('role' as any)}>
              <SelectTrigger><SelectValue placeholder="Pilih Role" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="GURU">Guru</SelectItem>
                <SelectItem value="SISWA">Siswa</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );
      case 'action':
        return (
          <div key={String(fieldName)} className="grid gap-2">
            <Label htmlFor="action">Action</Label>
            <Input id="action" placeholder="Action" {...form.register('action' as any)} />
          </div>
        );
      case 'type':
        return (
          <div key={String(fieldName)} className="grid gap-2">
            <Label htmlFor="type">Tipe Report</Label>
            <Select onValueChange={(value) => form.setValue('type' as any, value as any)} defaultValue={form.getValues('type' as any)}>
              <SelectTrigger><SelectValue placeholder="Pilih Tipe" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ABSENSI">Absensi</SelectItem>
                <SelectItem value="JURNAL">Jurnal</SelectItem>
                <SelectItem value="ACTIVITY">Activity</SelectItem>
                <SelectItem value="USER_SUMMARY">User Summary</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );
      case 'format':
        return (
          <div key={String(fieldName)} className="grid gap-2">
            <Label htmlFor="format">Format</Label>
            <Select onValueChange={(value) => form.setValue('format' as any, value as any)} defaultValue={form.getValues('format' as any)}>
              <SelectTrigger><SelectValue placeholder="Pilih Format" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="PDF">PDF</SelectItem>
                <SelectItem value="EXCEL">Excel</SelectItem>
                <SelectItem value="CSV">CSV</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );
      default:
        return null;
    }
  };

  const filterFields = useMemo(() => {
    // Define fields for each filter type
    const fieldMap = {
      jurnal: ['studentId', 'startDate', 'endDate', 'search'],
      absensi: ['studentId', 'tempatPklId', 'startDate', 'endDate', 'search'],
      activity: ['userId', 'role', 'action', 'startDate', 'endDate', 'search'],
      report: ['type', 'format', 'startDate', 'endDate', 'studentIds', 'tempatPklIds', 'includeDetails', 'groupBy'],
    };
    
    return fieldMap[type] || [];
  }, [type]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filter Data</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filterFields.map(field => renderField(field as keyof FilterSchema<T>))}
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={handleReset} disabled={isLoading}>Reset</Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Memfilter...' : 'Filter'}
            </Button>
          </div>
        </form>
        {activeFilters.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium">Filter Aktif:</h4>
            <div className="flex flex-wrap gap-2 mt-2">
              {activeFilters.map(([key, value]) => (
                <Badge key={key} variant="secondary">
                  {key}: {String(value)}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}