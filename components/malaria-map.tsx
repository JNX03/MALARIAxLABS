"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  MapPin, 
  AlertCircle, 
  Calendar, 
  Clock, 
  User, 
  Activity,
  TrendingUp,
  Bug,
  CheckCircle2,
  Navigation,
  ZoomIn,
  ZoomOut,
  Layers
} from "lucide-react"

// Define types for our malaria case data
export interface MalariaCase {
  id: string
  location: {
    lat: number
    lng: number
    province: string
    district: string
    subdistrict: string
  }
  patientInfo: {
    age: number
    gender: string
    occupation?: string
  }
  diagnosis: {
    date: string
    time: string
    status: 'positive' | 'negative' | 'inconclusive'
    parasiteType?: string
    parasiteDensity?: number
    stage?: string
  }
  reportedBy?: string
  notes?: string
}

// Sample data for Thailand malaria cases
const thailandCases: MalariaCase[] = [
  {
    id: "case-001",
    location: {
      lat: 16.9542,
      lng: 98.6234,
      province: "แม่ฮ่องสอน",
      district: "ปาย",
      subdistrict: "เวียงใต้"
    },
    patientInfo: {
      age: 35,
      gender: "ชาย",
      occupation: "เกษตรกร"
    },
    diagnosis: {
      date: "5-7 กรกฎาคม 2025",
      time: "08:00 น.",
      status: "positive",
      parasiteType: "Plasmodium falciparum",
      parasiteDensity: 2500,
      stage: "Ring"
    },
    reportedBy: "โรงพยาบาลปาย"
  },
  {
    id: "case-002",
    location: {
      lat: 18.7883,
      lng: 98.9853,
      province: "เชียงใหม่",
      district: "แม่แจ่ม",
      subdistrict: "ช่างเคิ่ง"
    },
    patientInfo: {
      age: 28,
      gender: "หญิง",
      occupation: "แม่บ้าน"
    },
    diagnosis: {
      date: "6 กรกฎาคม 2025",
      time: "14:30 น.",
      status: "positive",
      parasiteType: "Plasmodium vivax",
      parasiteDensity: 1800
    }
  },
  {
    id: "case-003",
    location: {
      lat: 15.2287,
      lng: 99.0545,
      province: "กาญจนบุรี",
      district: "สังขละบุรี",
      subdistrict: "หนองลู"
    },
    patientInfo: {
      age: 42,
      gender: "ชาย"
    },
    diagnosis: {
      date: "7 กรกฎาคม 2025",
      time: "10:15 น.",
      status: "negative"
    }
  },
  {
    id: "case-004",
    location: {
      lat: 14.0478,
      lng: 99.5323,
      province: "ราชบุรี",
      district: "สวนผึ้ง",
      subdistrict: "สวนผึ้ง"
    },
    patientInfo: {
      age: 19,
      gender: "ชาย",
      occupation: "นักเรียน"
    },
    diagnosis: {
      date: "8 กรกฎาคม 2025",
      time: "09:00 น.",
      status: "positive",
      parasiteType: "Plasmodium malariae",
      parasiteDensity: 950
    }
  },
  {
    id: "case-005",
    location: {
      lat: 12.5657,
      lng: 99.9575,
      province: "ประจวบคีรีขันธ์",
      district: "บางสะพาน",
      subdistrict: "แม่รำพึง"
    },
    patientInfo: {
      age: 55,
      gender: "หญิง"
    },
    diagnosis: {
      date: "8 กรกฎาคม 2025",
      time: "15:45 น.",
      status: "inconclusive"
    }
  }
]

// Map Component (dynamically imported to avoid SSR issues)
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
)

const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
)

const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
)

const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
)

const ZoomControl = dynamic(
  () => import("react-leaflet").then((mod) => mod.ZoomControl),
  { ssr: false }
)

export default function MalariaMap() {
  const [selectedCase, setSelectedCase] = useState<MalariaCase | null>(null)
  const [mapReady, setMapReady] = useState(false)
  const [L, setL] = useState<any>(null)

  useEffect(() => {
    // Import Leaflet only on client side
    import("leaflet").then((leaflet) => {
      setL(leaflet.default)
      
      // Fix for default marker icons in Leaflet with Webpack
      delete (leaflet.default.Icon.Default.prototype as any)._getIconUrl
      leaflet.default.Icon.Default.mergeOptions({
        iconRetinaUrl: "/marker-icon-2x.png",
        iconUrl: "/marker-icon.png",
        shadowUrl: "/marker-shadow.png",
      })
      
      setMapReady(true)
    })

    // Add Leaflet CSS
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
    document.head.appendChild(link)

    return () => {
      document.head.removeChild(link)
    }
  }, [])

  const getMarkerIcon = (status: string) => {
    if (!L) return null
    
    const iconHtml = status === 'positive' 
      ? `<div style="background: #ef4444; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10 2v8l2 2 2-2V2M2 12h8l2 2-2 2H2M14 12h8l-2 2-2-2h-4M10 14v8l2-2 2 2v-8"/>
          </svg>
        </div>`
      : status === 'negative'
      ? `<div style="background: #22c55e; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>`
      : `<div style="background: #eab308; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">
          <span style="font-weight: bold; font-size: 16px;">?</span>
        </div>`

    return L.divIcon({
      html: iconHtml,
      className: "custom-marker",
      iconSize: [30, 30],
      iconAnchor: [15, 15],
      popupAnchor: [0, -15]
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'positive': return 'bg-red-100 text-red-800 border-red-200'
      case 'negative': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'positive': return 'พบเชื้อ'
      case 'negative': return 'ไม่พบเชื้อ'
      default: return 'ไม่แน่ชัด'
    }
  }

  if (!mapReady) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span>กำลังโหลดแผนที่...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Map Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                แผนที่การติดตามผู้ป่วยมาลาเรีย
              </CardTitle>
              <CardDescription>
                ข้อมูลการตรวจพบเชื้อมาลาเรียในพื้นที่ต่างๆ ของประเทศไทย
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Badge variant="destructive" className="gap-1">
                <Bug className="h-3 w-3" />
                พบเชื้อ: 3 ราย
              </Badge>
              <Badge variant="default" className="gap-1 bg-green-600">
                <CheckCircle2 className="h-3 w-3" />
                ไม่พบเชื้อ: 1 ราย
              </Badge>
              <Badge variant="secondary" className="gap-1">
                <AlertCircle className="h-3 w-3" />
                ไม่แน่ชัด: 1 ราย
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Map Container */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div style={{ height: "600px", width: "100%" }}>
            <MapContainer
              center={[15.8700, 100.9925]} // Center of Thailand
              zoom={6}
              style={{ height: "100%", width: "100%" }}
              zoomControl={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <ZoomControl position="topright" />
              
              {thailandCases.map((mCase) => (
                <Marker
                  key={mCase.id}
                  position={[mCase.location.lat, mCase.location.lng]}
                  icon={getMarkerIcon(mCase.diagnosis.status)}
                  eventHandlers={{
                    click: () => setSelectedCase(mCase)
                  }}
                >
                  <Popup>
                    <div className="p-2 min-w-[280px]">
                      <h3 className="font-bold text-lg mb-2">
                        การตรวจพบที่ {mCase.location.district}
                      </h3>
                      
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium mb-3 ${getStatusColor(mCase.diagnosis.status)}`}>
                        {mCase.diagnosis.status === 'positive' && <Bug className="h-3 w-3" />}
                        {mCase.diagnosis.status === 'negative' && <CheckCircle2 className="h-3 w-3" />}
                        {mCase.diagnosis.status === 'inconclusive' && <AlertCircle className="h-3 w-3" />}
                        {getStatusText(mCase.diagnosis.status)}
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <div>
                            <div className="font-medium">สถานที่</div>
                            <div className="text-muted-foreground">
                              {mCase.location.subdistrict}, {mCase.location.district}, {mCase.location.province}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start gap-2">
                          <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <div>
                            <div className="font-medium">ข้อมูลผู้ป่วย</div>
                            <div className="text-muted-foreground">
                              {mCase.patientInfo.gender} อายุ {mCase.patientInfo.age} ปี
                              {mCase.patientInfo.occupation && ` (${mCase.patientInfo.occupation})`}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <div>
                            <div className="font-medium">วันที่ตรวจ</div>
                            <div className="text-muted-foreground">
                              {mCase.diagnosis.date} เวลา {mCase.diagnosis.time}
                            </div>
                          </div>
                        </div>

                        {mCase.diagnosis.parasiteType && (
                          <div className="flex items-start gap-2">
                            <Activity className="h-4 w-4 text-muted-foreground mt-0.5" />
                            <div>
                              <div className="font-medium">ชนิดเชื้อ</div>
                              <div className="text-muted-foreground">
                                {mCase.diagnosis.parasiteType}
                                {mCase.diagnosis.parasiteDensity && ` (${mCase.diagnosis.parasiteDensity} ตัว/μL)`}
                              </div>
                            </div>
                          </div>
                        )}

                        {mCase.reportedBy && (
                          <div className="pt-2 border-t">
                            <div className="text-xs text-muted-foreground">
                              รายงานโดย: {mCase.reportedBy}
                            </div>
                          </div>
                        )}
                      </div>

                      <Button 
                        className="w-full mt-3" 
                        size="sm"
                        onClick={() => setSelectedCase(mCase)}
                      >
                        ดูรายละเอียด
                      </Button>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </CardContent>
      </Card>

      {/* Selected Case Details */}
      {selectedCase && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>รายละเอียดการตรวจพบ</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedCase(null)}
              >
                ปิด
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">ข้อมูลผู้ป่วย</h4>
                <dl className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">เพศ:</dt>
                    <dd>{selectedCase.patientInfo.gender}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">อายุ:</dt>
                    <dd>{selectedCase.patientInfo.age} ปี</dd>
                  </div>
                  {selectedCase.patientInfo.occupation && (
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">อาชีพ:</dt>
                      <dd>{selectedCase.patientInfo.occupation}</dd>
                    </div>
                  )}
                </dl>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">ผลการตรวจ</h4>
                <dl className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">สถานะ:</dt>
                    <dd>
                      <Badge className={getStatusColor(selectedCase.diagnosis.status)}>
                        {getStatusText(selectedCase.diagnosis.status)}
                      </Badge>
                    </dd>
                  </div>
                  {selectedCase.diagnosis.parasiteType && (
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">ชนิดเชื้อ:</dt>
                      <dd>{selectedCase.diagnosis.parasiteType}</dd>
                    </div>
                  )}
                  {selectedCase.diagnosis.parasiteDensity && (
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">ความหนาแน่น:</dt>
                      <dd>{selectedCase.diagnosis.parasiteDensity} ตัว/μL</dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Map Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">คำอธิบายสัญลักษณ์</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-md"></div>
              <span>พบเชื้อมาลาเรีย</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-green-500 rounded-full border-2 border-white shadow-md"></div>
              <span>ไม่พบเชื้อมาลาเรีย</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-yellow-500 rounded-full border-2 border-white shadow-md"></div>
              <span>ผลไม่แน่ชัด</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}