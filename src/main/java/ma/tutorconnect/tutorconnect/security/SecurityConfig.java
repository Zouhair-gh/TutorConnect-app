package ma.tutorconnect.tutorconnect.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
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

    @Bean
    public JwtAuthenticationFilter jwtAuthFilter() {
        return new JwtAuthenticationFilter();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // Public endpoints that don't require authentication
                        .requestMatchers("/api/login", "/api/register", "/api/logout").permitAll()
                        .requestMatchers("/api/admin/users/all").permitAll()
                        .requestMatchers("/api/demands").permitAll()

                        // Admin-only endpoints
                        .requestMatchers("/api/admin/**").hasAuthority("ROLE_ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/tutors/all").hasRole("ADMIN")
                        .requestMatchers("/api/tutors").hasRole("ADMIN")
                        .requestMatchers("/admin/**").hasRole("ADMIN")
                        .requestMatchers("/users/get").hasRole("ADMIN")
                        .requestMatchers("/api/rooms/create", "/api/rooms/all").hasRole("ADMIN")

                        // Tutor-specific endpoints
                        .requestMatchers("/api/rooms/my-rooms").hasRole("TUTOR")
                        .requestMatchers("/api/rooms/request-room").hasRole("TUTOR")
                        .requestMatchers("/api/rooms/request-renewal/*").hasRole("TUTOR")
                        .requestMatchers(HttpMethod.POST, "/api/tickets").hasRole("TUTOR")
                        .requestMatchers(HttpMethod.POST, "/api/deliverables").hasAnyRole("TUTOR", "ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/deliverables/**").hasRole("TUTOR")
                        .requestMatchers(HttpMethod.POST, "/api/deliverables/grade").hasRole("TUTOR")
                        .requestMatchers(HttpMethod.PATCH, "/api/deliverables/*/visibility").hasRole("TUTOR")

                        // Participant-specific endpoints
                        .requestMatchers("/api/participants/my-rooms").hasAnyRole("PARTICIPANT", "ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/deliverables/submit").hasRole("PARTICIPANT")

                        // Staff-specific endpoints
                        .requestMatchers(HttpMethod.PUT, "/api/tickets/*/status").hasAnyRole("STAFF", "ADMIN")

                        // Shared endpoints (require any authenticated user)
                        .requestMatchers("/api/rooms/*/participants/**").hasAnyRole("TUTOR", "ADMIN", "PARTICIPANT")
                        .requestMatchers(HttpMethod.GET, "/api/rooms/*").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/api/demands/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/tickets").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/deliverables/room/**").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/deliverables/participant/*").hasAnyRole("PARTICIPANT", "TUTOR")
                        .requestMatchers(HttpMethod.GET, "/api/deliverables/{id}/comments").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/deliverables/{id}/comments").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/sessions/*/video").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/sessions/*/video").hasAnyRole("TUTOR", "ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/sessions/*/video/start").hasAnyRole("TUTOR", "ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/sessions/*/video/end").hasAnyRole("TUTOR", "ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/sessions/room/*").hasAnyRole("TUTOR", "ADMIN", "PARTICIPANT")
                        .requestMatchers(HttpMethod.POST, "/api/sessions/*/confirm-attendance").hasAnyRole("PARTICIPANT", "TUTOR", "ADMIN")

                        // All other endpoints require authentication
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Requested-With", "Accept"));
        configuration.setExposedHeaders(Arrays.asList("Authorization"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}