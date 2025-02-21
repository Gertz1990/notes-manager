import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";

export default function Home() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      setLocation("/notes");
    } else {
      setLocation("/auth");
    }
  }, [user, setLocation]);

  return null;
}

import { Rocket, Shield, Zap } from "lucide-react";

const features = [
  {
    icon: Rocket,
    title: "Молниеносная Скорость",
    description:
      "Испытайте беспрецедентную скорость и эффективность с нашей передовой технологией.",
  },
  {
    icon: Shield,
    title: "Безопасность от Природы",
    description:
      "Ваши данные защищены корпоративным уровнем безопасности и шифрования.",
  },
  {
    icon: Zap,
    title: "Мощные Функции",
    description:
      "Получите доступ к набору мощных инструментов, разработанных для улучшения вашего рабочего процесса.",
  },
];