#!/bin/bash

# ====================================
# BACKEND (NestJS) KURULUM KOMUTLARI
# ====================================

echo "🚀 Backend kurulumu başlıyor..."

# Backend dizinine git
cd mimo-api

# Paket yöneticisi olarak pnpm kur (yoksa)
npm install -g pnpm

# Tüm backend bağımlılıklarını kur
pnpm install

# Eksik olan NestJS modüllerini ekle
pnpm add @nestjs/passport passport passport-local @nestjs/passport
pnpm add @types/passport-local @types/bcrypt --save-dev

# Passport JWT stratejisi
pnpm add passport-jwt @types/passport-jwt

# Validation ve transformation
pnpm add class-validator class-transformer

# Prisma CLI'yı development dependency olarak ekle
pnpm add -D prisma
pnpm add @prisma/client

# Bcrypt for password hashing
pnpm add bcrypt @types/bcrypt

# Config management
pnpm add @nestjs/config

# Rate limiting
pnpm add @nestjs/throttler

# Cache management (opsiyonel ama önerilen)
pnpm add @nestjs/cache-manager cache-manager
pnpm add ioredis @types/cache-manager --save-dev

# CORS support
pnpm add @nestjs/platform-express

# Environment dosyasını oluştur
cp .env.example .env 2>/dev/null || cat > .env << 'EOL'
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/mimo?schema=public"

# JWT Secrets (Güvenlik için değiştirin!)
JWT_SECRET="your-super-secret-jwt-key-change-this-$(openssl rand -base64 32)"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-this-$(openssl rand -base64 32)"
JWT_EXPIRATION="15m"
JWT_REFRESH_EXPIRATION="7d"

# App Settings
PORT=3000
NODE_ENV="development"
FRONTEND_URL="http://localhost:8081"

# Rate Limiting
THROTTLE_TTL="60"
THROTTLE_LIMIT="10"
EOL

echo "✅ .env dosyası oluşturuldu"

# Prisma setup
echo "🔧 Prisma kurulumu..."
npx prisma generate

# Veritabanı migration (PostgreSQL'in kurulu ve çalışıyor olması gerekli)
echo "🗄️ Veritabanı migration başlıyor..."
echo "⚠️  PostgreSQL'in kurulu ve çalışıyor olduğundan emin olun!"
echo "Devam etmek için Enter'a basın..."
read

npx prisma migrate dev --name init

# Seed data yükle
echo "🌱 Test verileri yükleniyor..."
npx prisma db seed

echo "✅ Backend kurulumu tamamlandı!"
echo ""

# ====================================
# MOBILE APP (React Native) KURULUM KOMUTLARI
# ====================================

echo "📱 Mobile app kurulumu başlıyor..."

# Mobile app dizinine git
cd ../mimo-app

# Tüm mobile app bağımlılıklarını kur
npm install

# Eksik olan React Native ve Expo bağımlılıkları
npm install @react-native-async-storage/async-storage
npm install axios
npm install react-native-safe-area-context
npm install react-native-screens
npm install react-native-gesture-handler
npm install react-native-reanimated
npm install expo-status-bar
npm install expo-router
npm install expo-font
npm install expo-constants
npm install expo-linking
npm install expo-system-ui
npm install expo-web-browser

# TypeScript types
npm install --save-dev @types/react @types/react-native

# Navigation dependencies (expo-router'ın gerektirdiği)
npx expo install expo-splash-screen

# iOS için pod install (Mac'te çalışıyorsanız)
if [[ "$OSTYPE" == "darwin"* ]]; then
  echo "📱 iOS dependencies kurulumu..."
  cd ios && pod install && cd ..
fi

# API client dosyasını oluştur (src klasörü yoksa)
mkdir -p src/services/api
mkdir -p src/contexts

echo "✅ Mobile app kurulumu tamamlandı!"
echo ""

# ====================================
# PostgreSQL KURULUM KONTROLÜ
# ====================================

echo "🐘 PostgreSQL Kurulum Kontrolü..."

# PostgreSQL kurulu mu kontrol et
if command -v psql &> /dev/null; then
    echo "✅ PostgreSQL kurulu"
    
    # Veritabanı oluştur (hata verse bile devam et, zaten varsa sorun yok)
    createdb mimo 2>/dev/null && echo "✅ 'mimo' veritabanı oluşturuldu" || echo "ℹ️  'mimo' veritabanı zaten var veya oluşturulamadı"
else
    echo "⚠️  PostgreSQL kurulu değil!"
    echo ""
    echo "PostgreSQL kurulum komutları:"
    echo "================================"
    echo "macOS (Homebrew):"
    echo "  brew install postgresql"
    echo "  brew services start postgresql"
    echo ""
    echo "Ubuntu/Debian:"
    echo "  sudo apt update"
    echo "  sudo apt install postgresql postgresql-contrib"
    echo "  sudo systemctl start postgresql"
    echo ""
    echo "Windows:"
    echo "  https://www.postgresql.org/download/windows/ adresinden indirin"
    echo ""
fi

# ====================================
# ÇALIŞTIRMA KOMUTLARI
# ====================================

echo ""
echo "🎉 Kurulum tamamlandı!"
echo ""
echo "📝 Projeyi çalıştırmak için:"
echo "================================"
echo ""
echo "Terminal 1 - Backend:"
echo "  cd mimo-api"
echo "  pnpm start:dev"
echo ""
echo "Terminal 2 - Mobile App:"
echo "  cd mimo-app"
echo "  npx expo start"
echo ""
echo "📱 Expo Go uygulamasında QR kodu okutarak test edebilirsiniz"
echo ""
echo "🔑 Test Hesapları:"
echo "  Patient: patient1@test.com / Test123!"
echo "  Therapist: therapist1@test.com / Test123!"
echo "  Admin: admin@mimo.app / Admin123!"
echo ""
echo "🌐 API Endpoint: http://localhost:3000/api/v1"
echo "📊 Prisma Studio (DB görselleştirme): pnpm prisma studio"
echo ""

# ====================================
# HATA KONTROLÜ VE ÖNERİLER
# ====================================

echo "⚠️  Olası Sorunlar ve Çözümleri:"
echo "================================"
echo ""
echo "1. PostgreSQL bağlantı hatası:"
echo "   - PostgreSQL servisinin çalıştığından emin olun"
echo "   - .env dosyasındaki DATABASE_URL'yi kontrol edin"
echo ""
echo "2. Port çakışması (3000 portu kullanımda):"
echo "   - .env dosyasında PORT değerini değiştirin"
echo ""
echo "3. Android Emulator'de API'ye erişememe:"
echo "   - API_BASE_URL'de 'localhost' yerine '10.0.2.2' kullanın"
echo ""
echo "4. iOS Simulator'de network hatası:"
echo "   - Info.plist'e localhost exception ekleyin"
echo ""

# Script'i bitir
echo "✨ Her şey hazır! İyi kodlamalar!"
