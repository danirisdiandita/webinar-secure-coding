"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useSubscriptionStore } from "@/store/subscription-store"

export default function UpgradeButton() {
  const router = useRouter()
  const subscription = useSubscriptionStore()

  const handleClick = () => {
    router.push("/billing")
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      className="relative flex items-center justify-center"
    >
      <Button
        onClick={handleClick}
        disabled={subscription.loading}
        className="relative w-44 h-12 bg-gradient-to-r from-blue-500 to-purple-600 dark:from-gray-700 dark:to-gray-900 border-none overflow-hidden flex items-center justify-center rounded-lg shadow-lg transition-all hover:shadow-xl pb-3"
      >
        {subscription.loading ? (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Loader2 className="size-5 animate-spin text-white dark:text-gray-300" />
          </motion.div>
        ) : (
          <motion.div
            className="flex items-center justify-center gap-2 text-white font-semibold"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <span>Upgrade to</span>
            <motion.div
              whileHover={{
                scale: 1.1,
                transition: { duration: 0.3, type: "spring" },
              }}
            >
              <Badge
                variant="secondary"
                className="bg-white/20 text-white  dark:bg-black/20 px-3 py-1 rounded-md"
              >
                Pro
              </Badge>
            </motion.div>
          </motion.div>
        )}

        <motion.div
          className="absolute inset-0 bg-white/10"
          initial={{ x: "-100%", opacity: 0.4 }}
          whileHover={{
            x: "100%",
            opacity: 0.2,
            transition: { duration: 0.8, ease: "easeInOut" },
          }}
        />
      </Button>
    </motion.div>
  )
}
