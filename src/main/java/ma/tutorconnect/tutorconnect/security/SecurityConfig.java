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
                        .requestMatchers("/api/login", "/api/register", "/api/logout").permitAll()
                        .requestMatchers("/api/admin/**").hasAuthority("ROLE_ADMIN")
                        //  permissions for room endpoints
                        .requestMatchers("/api/rooms/create", "/api/rooms/all").hasRole("ADMIN")
                        .requestMatchers("/api/rooms/my-rooms").hasRole("TUTOR")
                        .requestMatchers("/api/rooms/request-room").hasRole("TUTOR")
                        .requestMatchers("/api/rooms/request-renewal/*").hasRole("TUTOR")
                        // Explicit permission for participant endpoints within rooms
                        .requestMatchers("/api/rooms/*/participants/**").hasAnyRole("TUTOR", "ADMIN", "PARTICIPANT")
                        // Fix: Add the correct path for the participant's my-rooms endpoint
                        .requestMatchers("/api/participants/my-rooms").hasRole("PARTICIPANT")
                        .requestMatchers(HttpMethod.GET, "/api/rooms/*").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/tickets").hasRole("TUTOR")
                        .requestMatchers("/api/demands").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/tickets").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/api/tickets/*/status").hasAnyRole("STAFF", "ADMIN")

                        // permissions for delivrable endpoints
                        .requestMatchers(HttpMethod.GET, "/api/deliverables/room/**").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/deliverables").hasAnyRole("TUTOR", "ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/deliverables/submit").hasRole("PARTICIPANT")
                        .requestMatchers(HttpMethod.DELETE, "/api/deliverables/**").hasRole("TUTOR")
                        .requestMatchers(HttpMethod.POST, "/api/deliverables/grade").hasRole("TUTOR")                        // MODIFIEZ/COMPLÉTEZ LES PERMISSIONS DES LIVRABLES :
                        .requestMatchers(HttpMethod.POST, "/api/deliverables/grade").hasRole("TUTOR")
                        .requestMatchers(HttpMethod.GET, "/api/deliverables/participant/*").hasAnyRole("PARTICIPANT", "TUTOR")
                        .requestMatchers(HttpMethod.PATCH, "/api/deliverables/*/visibility").hasRole("TUTOR")
                        .requestMatchers(HttpMethod.POST, "/api/deliverables/grade").permitAll()
                        // AJOUTEZ CES NOUVELLES PERMISSIONS :
                        .requestMatchers(HttpMethod.GET, "/api/deliverables/{id}/comments").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/deliverables/{id}/comments").authenticated()
                        // Video session endpoints permissions
                        .requestMatchers(HttpMethod.GET, "/api/sessions/*/video").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/sessions/*/video").hasAnyRole("TUTOR", "ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/sessions/*/video/start").hasAnyRole("TUTOR", "ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/sessions/*/video/end").hasAnyRole("TUTOR", "ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/sessions/room/*").hasAnyRole("TUTOR", "ADMIN", "PARTICIPANT")
                        .requestMatchers(HttpMethod.POST, "/api/sessions/*/confirm-attendance")
                        .hasAnyRole("PARTICIPANT", "TUTOR", "ADMIN")
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
        configuration.setAllowedMethods(Arrays.asList("*"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setExposedHeaders(Arrays.asList("Authorization"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}