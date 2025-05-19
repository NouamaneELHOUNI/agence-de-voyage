"use client"

import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

export function PackageCard({
    title,
    price,
    duration,
    description,
    features,
    featured = false,
    href = "/booking",
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
        >
            <Card
                className={cn("flex flex-col h-full transition-all hover:shadow-md", featured && "border-primary shadow-sm")}
            >
                {featured && (
                    <div className="absolute right-0 top-0 rounded-bl-lg rounded-tr-lg bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                        Popular
                    </div>
                )}
                <CardHeader>
                    <CardTitle className="text-xl">{title}</CardTitle>
                    <CardDescription className="text-base">{description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                    <div className="mb-4">
                        <span className="text-3xl font-bold">{price}</span>
                        <span className="text-muted-foreground"> / {duration}</span>
                    </div>
                    <ul className="space-y-2">
                        {features.map((feature, index) => (
                            <li key={index} className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-primary" />
                                <span className="text-sm">{feature}</span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
                <CardFooter>
                    <Button className="w-full" variant={featured ? "default" : "outline"} asChild>
                        <Link to={href}>{href.includes("/packages/") ? "View Details" : "Book Now"}</Link>
                    </Button>
                </CardFooter>
            </Card>
        </motion.div>
    )
}
