"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, ArrowLeft, Download, Share2 } from "lucide-react"

export default function ResultsPage() {
  const [activeTab, setActiveTab] = useState("overview")

  // Mock analysis results
  const results = {
    detected: true,
    accuracy: 94.7,
    type: "Plasmodium falciparum",
    parasitemia: "2.3%",
    stage: "Trophozoite",
    severity: "Moderate",
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString(),
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex items-center mb-6">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
        <h1 className="text-3xl font-bold ml-4">Analysis Results</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">Malaria Detection Results</CardTitle>
                  <CardDescription>
                    Analysis completed on {results.date} at {results.time}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="details">Detailed Analysis</TabsTrigger>
                  <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-medium mb-2">Diagnosis</h3>
                        <div className="flex items-center gap-2 text-2xl font-bold text-red-500">
                          <AlertTriangle className="h-6 w-6" />
                          Malaria Detected
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-2">Confidence Level</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Accuracy</span>
                            <span className="font-medium">{results.accuracy}%</span>
                          </div>
                          <Progress value={results.accuracy} className="h-2" />
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-2">Parasite Type</h3>
                        <p className="text-xl font-semibold">{results.type}</p>
                        <p className="text-sm text-muted-foreground">
                          The most severe form of malaria, with the highest rates of complications and mortality.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-medium mb-2">Sample Image</h3>
                        <div className="border rounded-md overflow-hidden">
                          <img
                            src="/placeholder.svg?height=300&width=400"
                            alt="Blood sample"
                            className="w-full h-auto"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium">Parasitemia</h4>
                          <p>{results.parasitemia}</p>
                        </div>
                        <div>
                          <h4 className="font-medium">Stage</h4>
                          <p>{results.stage}</p>
                        </div>
                        <div>
                          <h4 className="font-medium">Severity</h4>
                          <p>{results.severity}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="details" className="mt-6 space-y-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Parasite Morphology</h3>
                      <p>
                        The analysis detected <strong>Plasmodium falciparum</strong> trophozoites in the blood sample.
                        The parasites appear as small ring forms within red blood cells, with some showing
                        characteristic double chromatin dots and appliqué forms.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-2">Quantitative Analysis</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Card>
                          <CardContent className="p-4">
                            <div className="text-sm text-muted-foreground">Parasitemia</div>
                            <div className="text-xl font-bold">{results.parasitemia}</div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4">
                            <div className="text-sm text-muted-foreground">Infected RBCs</div>
                            <div className="text-xl font-bold">127</div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4">
                            <div className="text-sm text-muted-foreground">Total RBCs</div>
                            <div className="text-xl font-bold">5,523</div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4">
                            <div className="text-sm text-muted-foreground">Parasite Density</div>
                            <div className="text-xl font-bold">12,700/µL</div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-2">Detection Confidence</h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>P. falciparum</span>
                            <span className="font-medium">94.7%</span>
                          </div>
                          <Progress value={94.7} className="h-2" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>P. vivax</span>
                            <span className="font-medium">3.2%</span>
                          </div>
                          <Progress value={3.2} className="h-2" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>P. malariae</span>
                            <span className="font-medium">1.5%</span>
                          </div>
                          <Progress value={1.5} className="h-2" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>P. ovale</span>
                            <span className="font-medium">0.6%</span>
                          </div>
                          <Progress value={0.6} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="recommendations" className="mt-6 space-y-6">
                  <div className="space-y-6">
                    <div>
                    <h3 className="text-4xl font-medium mb-3">Gen แชทมานะขี้เกียจเขียน</h3>

                      <h3 className="text-lg font-medium mb-2">Treatment Recommendations</h3>
                      <div className="bg-amber-50 border border-amber-200 rounded-md p-4 text-amber-800">
                        <p className="font-medium mb-2">
                          Recommended first-line treatment for uncomplicated P. falciparum malaria:
                        </p>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Artemisinin-based combination therapy (ACT)</li>
                          <li>Specifically: Artemether-lumefantrine or Artesunate-mefloquine</li>
                          <li>Treatment duration: 3 days</li>
                          <li>Follow national treatment guidelines for exact dosing based on patient weight</li>
                        </ul>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-2">Patient Monitoring</h3>
                      <p className="mb-2">
                        Based on the parasitemia level of {results.parasitemia} and the identification of {results.type}
                        , the following monitoring is recommended:
                      </p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Monitor patient for 24-48 hours to ensure clinical improvement</li>
                        <li>Repeat blood smear after 24 hours to confirm reduction in parasitemia</li>
                        <li>Check for signs of severe malaria (impaired consciousness, respiratory distress, etc.)</li>
                        <li>Ensure adequate fluid intake and antipyretics as needed</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-2">Follow-up Testing</h3>
                      <p>
                        Schedule follow-up blood smear examinations on days 3, 7, and 14 after treatment initiation to
                        confirm parasite clearance and monitor for recrudescence.
                      </p>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-blue-800">
                      <p className="font-medium">Important Note:</p>
                      <p>
                        This analysis is provided as a decision support tool. Final diagnosis and treatment decisions
                        should be made by qualified healthcare professionals in accordance with local guidelines and the
                        patient's clinical condition.
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Patient Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Sample ID</h3>
                <p>MRL-2023-05-15-0042</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Collection Date</h3>
                <p>{results.date}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Analysis Time</h3>
                <p>{results.time}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Location</h3>
                <p>Mae Hong Son Province, Thailand</p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-4">
              <div className="w-full">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Case Severity</h3>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: "65%" }}></div>
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span>Mild</span>
                  <span className="font-medium">Moderate</span>
                  <span>Severe</span>
                </div>
              </div>

              <Button className="w-full">Generate Report</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

