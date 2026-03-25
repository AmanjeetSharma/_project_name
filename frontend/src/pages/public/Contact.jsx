import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Contact() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-6 md:p-12">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto text-center mb-16"
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-6">Contact Us</h1>
        <p className="text-lg text-muted-foreground">
          Have questions or need guidance? We're here to help you make the right decisions.
        </p>
      </motion.div>

      {/* Content */}
      <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Card className="rounded-2xl shadow-md h-full">
            <CardContent className="p-6 flex flex-col gap-6">
              <h2 className="text-2xl font-semibold">Get in Touch</h2>

              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10 text-primary">
                  <Mail />
                </div>
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">support@advisor.com</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10 text-primary">
                  <Phone />
                </div>
                <div>
                  <p className="font-medium">Phone</p>
                  <p className="text-sm text-muted-foreground">+91 98765 43210</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10 text-primary">
                  <MapPin />
                </div>
                <div>
                  <p className="font-medium">Location</p>
                  <p className="text-sm text-muted-foreground">India</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Card className="rounded-2xl shadow-md">
            <CardContent className="p-6 flex flex-col gap-4">
              <h2 className="text-2xl font-semibold">Send a Message</h2>

              <Input placeholder="Your Name" />
              <Input placeholder="Your Email" type="email" />
              <Textarea placeholder="Your Message" rows={5} />

              <Button className="mt-4 rounded-xl text-lg">
                Send Message
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
