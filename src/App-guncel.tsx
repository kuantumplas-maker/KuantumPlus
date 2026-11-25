
import { useState, type DragEvent } from 'react'
import { initialStudents } from './studentsData'
import './App.css'

type Student = {
  id: number
  name: string
  className: string
  phone: string
  parentPhone: string
  studentNo?: string
  grade?: string
  field?: string
  counselor?: string
}

// Excel listesinden aktarılan 164 öğrenci
const importedStudents: Student[] = initialStudents.map((student) => ({
  id: student.id,
  name: student.name,
  className: student.className || (student.grade ? `${Number(student.grade)}. Sınıf` : 'Sınıf bilgisi yok'),
  phone: student.phone || '',
  parentPhone: student.parentPhone || '',
  studentNo: student.studentNo,
  grade: student.grade,
  field: student.field,
  counselor: student.counselor,
}))

const firstStudentId = String(importedStudents[0]?.id ?? '')

type TaskStatus = 'Bekliyor' | 'Tamamlandı' | 'Eksik' | 'Ertelendi'

type StudyTask = {
  id: number
  studentId: string
  day: string
  subject: string
  unit: string
  topic: string
  source: string
  test: string
  questions: number
  duration: number
  startTime: string
  status: TaskStatus
}

const days = [
  'Pazartesi',
  'Salı',
  'Çarşamba',
  'Perşembe',
  'Cuma',
  'Cumartesi',
  'Pazar',
]

const subjectsByProgram: Record<string, string[]> = {
  LGS: [
    'Türkçe',
    'Matematik',
    'Fen Bilimleri',
    'T.C. İnkılap Tarihi',
    'Din Kültürü',
    'İngilizce',
  ],
  TYT: [
    'Türkçe',
    'Matematik',
    'Geometri',
    'Fizik',
    'Kimya',
    'Biyoloji',
    'Tarih',
    'Coğrafya',
    'Felsefe',
    'Din Kültürü',
  ],
  AYT: [
    'AYT Matematik',
    'Geometri',
    'Fizik',
    'Kimya',
    'Biyoloji',
    'Edebiyat',
    'Tarih',
    'Coğrafya',
    'Felsefe',
  ],
}

const units: Record<string, string[]> = {
  Türkçe: [
    'Sözcükte Anlam',
