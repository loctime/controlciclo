import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  deleteDoc,
  updateDoc,
  onSnapshot,
  Unsubscribe
} from 'firebase/firestore'
import { db } from './firebase'

// Tipos de datos
export interface UserData {
  cycleLength: number
  periodLength: number
  lastPeriodDate: string
  setupDate: string
}

export interface PeriodLog {
  startDate: string
  endDate?: string
  symptoms?: string[]
}

export interface SymptomLog {
  date: string
  flow?: "light" | "medium" | "heavy" | "spotting"
  mood?: "happy" | "neutral" | "sad" | "anxious" | "irritable"
  symptoms: string[]
  notes?: string
}

// Funciones para UserData
export async function saveUserData(userId: string, data: UserData): Promise<void> {
  const userRef = doc(db, 'apps', 'controlciclo', 'users', userId)
  await setDoc(userRef, data)
}

export async function getUserData(userId: string): Promise<UserData | null> {
  const userRef = doc(db, 'apps', 'controlciclo', 'users', userId)
  const docSnap = await getDoc(userRef)
  
  if (docSnap.exists()) {
    return docSnap.data() as UserData
  }
  return null
}

export function subscribeToUserData(userId: string, callback: (data: UserData | null) => void): Unsubscribe {
  const userRef = doc(db, 'apps', 'controlciclo', 'users', userId)
  return onSnapshot(userRef, (doc) => {
    if (doc.exists()) {
      callback(doc.data() as UserData)
    } else {
      callback(null)
    }
  })
}

// Funciones para PeriodLogs
export async function savePeriodLog(userId: string, log: PeriodLog): Promise<string> {
  const logsRef = collection(db, 'apps', 'controlciclo', 'users', userId, 'periodLogs')
  const docRef = await addDoc(logsRef, log)
  return docRef.id
}

export async function getPeriodLogs(userId: string): Promise<PeriodLog[]> {
  const logsRef = collection(db, 'apps', 'controlciclo', 'users', userId, 'periodLogs')
  const q = query(logsRef, orderBy('startDate', 'desc'))
  const querySnapshot = await getDocs(q)
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as PeriodLog & { id: string }))
}

export function subscribeToPeriodLogs(userId: string, callback: (logs: (PeriodLog & { id: string })[]) => void): Unsubscribe {
  const logsRef = collection(db, 'apps', 'controlciclo', 'users', userId, 'periodLogs')
  const q = query(logsRef, orderBy('startDate', 'desc'))
  
  return onSnapshot(q, (querySnapshot) => {
    const logs = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as PeriodLog & { id: string }))
    callback(logs)
  })
}

// Funciones para SymptomLogs
export async function saveSymptomLog(userId: string, log: SymptomLog): Promise<string> {
  const logsRef = collection(db, 'apps', 'controlciclo', 'users', userId, 'symptomLogs')
  const docRef = await addDoc(logsRef, log)
  return docRef.id
}

export async function getSymptomLogs(userId: string): Promise<SymptomLog[]> {
  const logsRef = collection(db, 'apps', 'controlciclo', 'users', userId, 'symptomLogs')
  const q = query(logsRef, orderBy('date', 'desc'))
  const querySnapshot = await getDocs(q)
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as SymptomLog & { id: string }))
}

export function subscribeToSymptomLogs(userId: string, callback: (logs: (SymptomLog & { id: string })[]) => void): Unsubscribe {
  const logsRef = collection(db, 'apps', 'controlciclo', 'users', userId, 'symptomLogs')
  const q = query(logsRef, orderBy('date', 'desc'))
  
  return onSnapshot(q, (querySnapshot) => {
    const logs = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as SymptomLog & { id: string }))
    callback(logs)
  })
}

// Función para actualizar configuración del usuario
export async function updateUserSettings(userId: string, settings: Partial<UserData>): Promise<void> {
  const userRef = doc(db, 'apps', 'controlciclo', 'users', userId)
  await updateDoc(userRef, settings)
}

// Función para eliminar todos los datos del usuario
export async function deleteAllUserData(userId: string): Promise<void> {
  // Eliminar userData
  const userRef = doc(db, 'apps', 'controlciclo', 'users', userId)
  await deleteDoc(userRef)
  
  // Eliminar periodLogs
  const periodLogsRef = collection(db, 'apps', 'controlciclo', 'users', userId, 'periodLogs')
  const periodLogsSnapshot = await getDocs(periodLogsRef)
  const periodLogsPromises = periodLogsSnapshot.docs.map(doc => deleteDoc(doc.ref))
  await Promise.all(periodLogsPromises)
  
  // Eliminar symptomLogs
  const symptomLogsRef = collection(db, 'apps', 'controlciclo', 'users', userId, 'symptomLogs')
  const symptomLogsSnapshot = await getDocs(symptomLogsRef)
  const symptomLogsPromises = symptomLogsSnapshot.docs.map(doc => deleteDoc(doc.ref))
  await Promise.all(symptomLogsPromises)
}

// Función para exportar todos los datos del usuario
export async function exportUserData(userId: string): Promise<{
  userData: UserData | null
  periodLogs: (PeriodLog & { id: string })[]
  symptomLogs: (SymptomLog & { id: string })[]
  exportDate: string
}> {
  const [userData, periodLogs, symptomLogs] = await Promise.all([
    getUserData(userId),
    getPeriodLogs(userId),
    getSymptomLogs(userId)
  ])
  
  return {
    userData,
    periodLogs,
    symptomLogs,
    exportDate: new Date().toISOString()
  }
}
