import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Calendar, MapPin, DollarSign, Upload, FileText, Clock, Trash, ChevronDown, ChevronUp } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function BuildItinerary() {
  const [tripTitle, setTripTitle] = useState("My Amazing Trip");
  const [tripBudget, setTripBudget] = useState(1000);
  const [tripDates, setTripDates] = useState({ start: "", end: "" });
  const [stops, setStops] = useState<any[]>([]);
  const [documents, setDocuments] = useState<File[]>([]);
  const [expandedStop, setExpandedStop] = useState<number | null>(null);

  const addStop = () => {
    setStops(prev => [...prev, { city: "New City", date: "", activities: [] }]);
  };

  const addActivity = (stopIndex: number) => {
    const updated = [...stops];
    updated[stopIndex].activities.push({ name: "New Activity", time: "12:00", cost: 0, description: "" });
    setStops(updated);
  };

  const updateActivity = (stopIndex: number, activityIndex: number, field: string, value: any) => {
    const updated = [...stops];
    updated[stopIndex].activities[activityIndex][field] = value;
    setStops(updated);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setDocuments(prev => [...prev, ...Array.from(e.target.files)]);
  };

  const totalUsedBudget = stops.reduce((sum, stop) => sum + stop.activities.reduce((a: number, act: any) => a + (act.cost || 0), 0), 0);

  return (
    <Layout>
      <div className="min-h-screen bg-muted/30 py-4 px-4">
        
        {/* Sticky Header */}
        <div className="sticky top-0 bg-muted/80 backdrop-blur-md z-10 p-3 flex justify-between items-center shadow-sm">
          <h1 className="font-bold text-lg">{tripTitle}</h1>
          <Button variant="hero" size="sm">Save Trip</Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mt-4">
          
          {/* Left Column - Trip Details */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader><CardTitle>Trip Details</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <Input value={tripTitle} onChange={(e) => setTripTitle(e.target.value)} placeholder="Trip Title" />
                <div className="flex gap-2">
                  <Input type="date" value={tripDates.start} onChange={(e) => setTripDates({ ...tripDates, start: e.target.value })} />
                  <Input type="date" value={tripDates.end} onChange={(e) => setTripDates({ ...tripDates, end: e.target.value })} />
                </div>
                <Input type="number" value={tripBudget} onChange={(e) => setTripBudget(Number(e.target.value))} placeholder="Budget" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><DollarSign /> Budget Overview</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-3 text-center">
                <motion.div layout className="font-bold">₹{tripBudget} <p className="text-sm">Total</p></motion.div>
                <motion.div layout className="text-warning">₹{totalUsedBudget} <p className="text-sm">Used</p></motion.div>
                <motion.div layout className="text-success">₹{tripBudget - totalUsedBudget} <p className="text-sm">Left</p></motion.div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><FileText /> Documents</CardTitle></CardHeader>
              <CardContent>
                <Input type="file" multiple onChange={handleFileUpload} />
                <AnimatePresence>
                  {documents.map((doc, idx) => (
                    <motion.div key={idx} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="mt-2 text-sm">
                      📄 {doc.name}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Stops */}
          <div className="lg:col-span-2 space-y-4">
            {stops.map((stop, sIndex) => (
              <Card key={sIndex}>
                <CardHeader 
                  className="flex justify-between items-center cursor-pointer hover:bg-muted/50 transition"
                  onClick={() => setExpandedStop(expandedStop === sIndex ? null : sIndex)}
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="text-primary" />
                    <Input 
                      value={stop.city} 
                      onClick={(e) => e.stopPropagation()} 
                      onChange={(e) => { 
                        const updated = [...stops];
                        updated[sIndex].city = e.target.value;
                        setStops(updated);
                      }} 
                      className="w-32"
                    />
                    <Input 
                      type="date" 
                      value={stop.date} 
                      onClick={(e) => e.stopPropagation()} 
                      onChange={(e) => { 
                        const updated = [...stops];
                        updated[sIndex].date = e.target.value;
                        setStops(updated);
                      }} 
                    />
                  </div>
                  {expandedStop === sIndex ? <ChevronUp /> : <ChevronDown />}
                </CardHeader>

                <AnimatePresence>
                  {expandedStop === sIndex && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <CardContent className="space-y-3">
                        {stop.activities.map((act: any, aIndex: number) => (
                          <motion.div 
                            key={aIndex} 
                            initial={{ opacity: 0, y: 5 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            exit={{ opacity: 0, y: -5 }}
                            className="p-3 border rounded-md flex flex-col gap-2 bg-white"
                          >
                            <div className="flex gap-2 items-center">
                              <Clock className="text-muted-foreground" />
                              <Input type="time" value={act.time} onChange={(e) => updateActivity(sIndex, aIndex, "time", e.target.value)} className="w-28" />
                              <Input value={act.name} onChange={(e) => updateActivity(sIndex, aIndex, "name", e.target.value)} />
                              <Input type="number" value={act.cost} onChange={(e) => updateActivity(sIndex, aIndex, "cost", Number(e.target.value))} className="w-24" />
                              <Button size="sm" variant="destructive" onClick={() => {
                                const updated = [...stops];
                                updated[sIndex].activities.splice(aIndex, 1);
                                setStops(updated);
                              }}>
                                <Trash />
                              </Button>
                            </div>
                            <Textarea value={act.description} onChange={(e) => updateActivity(sIndex, aIndex, "description", e.target.value)} placeholder="Notes..." />
                          </motion.div>
                        ))}
                        <Button variant="outline" onClick={() => addActivity(sIndex)}><Plus /> Add Activity</Button>
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            ))}

            <Button variant="outline" onClick={addStop} className="w-full h-16 border-dashed border-2">
              <Plus /> Add New Stop
            </Button>
          </div>

        </div>
      </div>
    </Layout>
  );
}
