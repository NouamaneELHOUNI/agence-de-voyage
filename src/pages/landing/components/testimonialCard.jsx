import { Star } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export function TestimonialCard({ name, location, quote, rating }) {
    return (
        <Card className="transition-all hover:shadow-md">
            <CardHeader className="pb-2">
                <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < rating ? "fill-primary text-primary" : "fill-muted text-muted"}`} />
                    ))}
                </div>
            </CardHeader>
            <CardContent>
                <blockquote className="text-base italic">"{quote}"</blockquote>
            </CardContent>
            <CardFooter className="border-t pt-4">
                <div>
                    <p className="font-medium">{name}</p>
                    <p className="text-sm text-muted-foreground">{location}</p>
                </div>
            </CardFooter>
        </Card>
    )
}
