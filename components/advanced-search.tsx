"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { 
  Search, 
  Filter, 
  X, 
  CalendarIcon,
  MapPin,
  User,
  Bug,
  Activity,
  Settings2
} from "lucide-react"
import { format } from "date-fns"

interface SearchFilters {
  searchTerm: string
  status: string[]
  dateRange: { from: Date | undefined; to: Date | undefined }
  location: string
  parasiteType: string[]
  confidenceRange: { min: number; max: number }
  ageRange: { min: number; max: number }
  gender: string
}

interface AdvancedSearchProps {
  filters: SearchFilters
  onFiltersChange: (filters: SearchFilters) => void
  onSearch: () => void
  onReset: () => void
}

export default function AdvancedSearch({
  filters,
  onFiltersChange,
  onSearch,
  onReset
}: AdvancedSearchProps) {
  const [isOpen, setIsOpen] = useState(false)

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const toggleStatus = (status: string) => {
    const newStatuses = filters.status.includes(status)
      ? filters.status.filter(s => s !== status)
      : [...filters.status, status]
    updateFilter('status', newStatuses)
  }

  const toggleParasiteType = (type: string) => {
    const newTypes = filters.parasiteType.includes(type)
      ? filters.parasiteType.filter(t => t !== type)
      : [...filters.parasiteType, type]
    updateFilter('parasiteType', newTypes)
  }

  const getActiveFilterCount = () => {
    let count = 0
    if (filters.searchTerm) count++
    if (filters.status.length) count++
    if (filters.dateRange.from || filters.dateRange.to) count++
    if (filters.location) count++
    if (filters.parasiteType.length) count++
    if (filters.confidenceRange.min > 0 || filters.confidenceRange.max < 100) count++
    if (filters.ageRange.min > 0 || filters.ageRange.max < 100) count++
    if (filters.gender) count++
    return count
  }

  const statusOptions = [
    { value: 'positive', label: 'Positive', color: 'bg-red-500' },
    { value: 'negative', label: 'Negative', color: 'bg-green-500' },
    { value: 'inconclusive', label: 'Inconclusive', color: 'bg-yellow-500' }
  ]

  const parasiteTypes = [
    'Plasmodium falciparum',
    'Plasmodium vivax',
    'Plasmodium malariae',
    'Plasmodium ovale',
    'Plasmodium knowlesi'
  ]

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <CardTitle>Advanced Search & Filters</CardTitle>
            {getActiveFilterCount() > 0 && (
              <Badge variant="secondary">
                {getActiveFilterCount()} active
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="gap-2"
            >
              <Settings2 className="h-4 w-4" />
              {isOpen ? 'Hide Filters' : 'Show Filters'}
            </Button>
            <Button onClick={onReset} variant="ghost" size="sm">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Basic Search */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by patient ID, location, notes..."
              value={filters.searchTerm}
              onChange={(e) => updateFilter('searchTerm', e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={onSearch} className="gap-2">
            <Search className="h-4 w-4" />
            Search
          </Button>
        </div>

        {/* Active Filters */}
        {getActiveFilterCount() > 0 && (
          <div className="flex flex-wrap gap-2">
            {filters.searchTerm && (
              <Badge variant="secondary" className="gap-1">
                Search: {filters.searchTerm}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => updateFilter('searchTerm', '')}
                />
              </Badge>
            )}
            {filters.status.map(status => (
              <Badge key={status} variant="secondary" className="gap-1">
                {status}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => toggleStatus(status)}
                />
              </Badge>
            ))}
            {filters.location && (
              <Badge variant="secondary" className="gap-1">
                <MapPin className="h-3 w-3" />
                {filters.location}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => updateFilter('location', '')}
                />
              </Badge>
            )}
          </div>
        )}

        {/* Advanced Filters */}
        {isOpen && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 border rounded-lg bg-muted/30">
            {/* Status Filter */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Test Status
              </Label>
              <div className="space-y-2">
                {statusOptions.map(option => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={option.value}
                      checked={filters.status.includes(option.value)}
                      onChange={() => toggleStatus(option.value)}
                      className="rounded"
                    />
                    <label htmlFor={option.value} className="flex items-center gap-2 cursor-pointer">
                      <div className={`w-3 h-3 rounded-full ${option.color}`} />
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Date Range */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                Date Range
              </Label>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="justify-start text-left">
                      {filters.dateRange.from ? (
                        format(filters.dateRange.from, "MMM dd")
                      ) : (
                        "From"
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={filters.dateRange.from}
                      onSelect={(date) => 
                        updateFilter('dateRange', { ...filters.dateRange, from: date })
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="justify-start text-left">
                      {filters.dateRange.to ? (
                        format(filters.dateRange.to, "MMM dd")
                      ) : (
                        "To"
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={filters.dateRange.to}
                      onSelect={(date) => 
                        updateFilter('dateRange', { ...filters.dateRange, to: date })
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Location
              </Label>
              <Select value={filters.location} onValueChange={(value) => updateFilter('location', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select province" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Locations</SelectItem>
                  <SelectItem value="bangkok">Bangkok</SelectItem>
                  <SelectItem value="chiangmai">Chiang Mai</SelectItem>
                  <SelectItem value="maehongson">Mae Hong Son</SelectItem>
                  <SelectItem value="kanchanaburi">Kanchanaburi</SelectItem>
                  <SelectItem value="tak">Tak</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Parasite Types */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Bug className="h-4 w-4" />
                Parasite Types
              </Label>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {parasiteTypes.map(type => (
                  <div key={type} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={type}
                      checked={filters.parasiteType.includes(type)}
                      onChange={() => toggleParasiteType(type)}
                      className="rounded"
                    />
                    <label htmlFor={type} className="text-sm cursor-pointer">
                      {type}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Confidence Range */}
            <div className="space-y-2">
              <Label>Confidence Range (%)</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  min="0"
                  max="100"
                  value={filters.confidenceRange.min}
                  onChange={(e) => 
                    updateFilter('confidenceRange', {
                      ...filters.confidenceRange,
                      min: parseInt(e.target.value) || 0
                    })
                  }
                />
                <Input
                  type="number"
                  placeholder="Max"
                  min="0"
                  max="100"
                  value={filters.confidenceRange.max}
                  onChange={(e) => 
                    updateFilter('confidenceRange', {
                      ...filters.confidenceRange,
                      max: parseInt(e.target.value) || 100
                    })
                  }
                />
              </div>
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Gender
              </Label>
              <Select value={filters.gender} onValueChange={(value) => updateFilter('gender', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Genders" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Genders</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}