"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const timelineItems = [
  {
    year: "2005",
    title: "Company Founded",
    description:
      "Al-Safar Hajj & Umrah Services was founded by Haji Abdullah Rahman after his own pilgrimage experience.",
  },
  {
    year: "2008",
    title: "First Group Hajj",
    description:
      "Successfully organized our first group Hajj with 50 pilgrims, establishing our reputation for quality service.",
  },
  {
    year: "2010",
    title: "Expanded Services",
    description:
      "Added year-round Umrah packages to our offerings, allowing more Muslims to perform the sacred pilgrimage.",
  },
  {
    year: "2013",
    title: "International Expansion",
    description: "Opened offices in multiple countries to better serve pilgrims from around the world.",
  },
  {
    year: "2015",
    title: "10th Anniversary",
    description: "Celebrated 10 years of service with over 5,000 pilgrims served and introduced premium packages.",
  },
  {
    year: "2018",
    title: "Digital Transformation",
    description:
      "Launched our online booking system and mobile app to make the booking process more convenient for pilgrims.",
  },
  {
    year: "2020",
    title: "Pandemic Response",
    description:
      "Adapted to the global pandemic with flexible booking policies and virtual pre-Hajj orientation sessions.",
  },
  {
    year: "2023",
    title: "Today",
    description:
      "Continuing to serve pilgrims with excellence, now offering a wider range of packages to suit different needs and budgets.",
  },
]

export function Timeline() {
  return (
    <div className="relative">
      {/* Center line */}
      <div className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-border" />

      <div className="space-y-12">
        {timelineItems.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true, margin: "-100px" }}
            className={cn(
              "relative grid grid-cols-1 gap-6 md:grid-cols-2",
              index % 2 === 0 ? "md:text-right" : "md:text-left md:grid-flow-dense",
            )}
          >
            {/* Year marker */}
            <div
              className={cn(
                "absolute left-1/2 top-0 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full border bg-background text-sm font-bold shadow",
                index === timelineItems.length - 1 && "bg-primary text-primary-foreground",
              )}
            >
              {item.year}
            </div>

            {/* Content */}
            <div
              className={cn("md:col-span-1", index % 2 === 0 ? "md:text-right md:pr-10" : "md:col-start-2 md:pl-10")}
            >
              <div className="rounded-lg bg-background p-6 shadow-sm">
                <h3 className="text-xl font-bold">{item.title}</h3>
                <p className="mt-2 text-muted-foreground">{item.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
