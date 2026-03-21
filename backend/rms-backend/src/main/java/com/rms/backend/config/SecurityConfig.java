package com.rms.backend.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod; // ✅ อย่าลืม import HttpMethod
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthFilter jwtAuthFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // 🔓 ระบบ Auth ทั่วไป (Login/Register)
                        .requestMatchers("/api/auth/**", "/login", "/register").permitAll()

                        // 🔓 โซนของลูกค้า (Guest) ไม่ต้องล็อกอินก็ดูร้านค้าและซื้อของได้!
                        .requestMatchers(HttpMethod.GET, "/api/shops/**").permitAll()     // ให้ดึงข้อมูลร้านและ Slug ได้
                        .requestMatchers(HttpMethod.GET, "/api/products/**").permitAll()  // ให้ดึงข้อมูลสินค้าในร้านได้
                        .requestMatchers(HttpMethod.POST, "/api/orders/checkout").permitAll() // ให้กดยืนยันสั่งซื้อได้
                        .requestMatchers(HttpMethod.GET, "/api/orders/track/**").permitAll()  // ให้เช็คสถานะพัสดุได้

                        // 🔒 ส่วนที่เหลือ (Admin, Reseller, แก้ไขข้อมูลต่างๆ) ต้องมี Token
                        .anyRequest().authenticated()
                );

        http.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // อนุญาต Origins ตามที่คุณใช้งานจริง
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173", "https://bootcamp04.duckdns.org"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Accept"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}